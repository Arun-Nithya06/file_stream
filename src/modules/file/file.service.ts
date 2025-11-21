import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { CsvRecord } from 'src/common/interfaces/stream.interface';
import { Readable, Transform, Writable } from 'stream';
import { pipeline } from 'stream/promises';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @InjectModel('Record') private readonly recordModel: Model<any>,
  ) {}

  // =====================================================
  //                  CSV IMPORT
  // =====================================================
  async importCsv(buffer: Buffer) {
    this.logger.log('CSV import started.');
    const start = Date.now();
    let inserted = 0;

    const stream = Readable.from(buffer.toString().split('\n'));

    try {
      await pipeline(
        stream,
        this.csvParser(),
        this.dbWriter(() => inserted++),
      );

      const duration = Date.now() - start;
      this.logger.log(
        `CSV import completed. Inserted: ${inserted} records. Time: ${duration}ms`,
      );

      return { success: true, inserted };
    } catch (err) {
      this.logger.error('CSV import failed', err.stack);
      return { success: false, inserted };
    }
  }

  // ---------------- CSV PARSER ----------------
  private csvParser() {
    let isHeader = true;

    return new Transform({
      objectMode: true,

      transform(line: string, _enc, cb) {
        try {
          const clean = line.trim();
          if (!clean) return cb(); // skip empty

          if (isHeader) {
            isHeader = false;
            return cb(); // skip header row
          }

          const [name, email, age] = clean.split(',');

          const record: CsvRecord = {
            name: name?.trim() || null,
            email: email?.trim() || null,
            age: age ? Number(age) : null,
          };

          return cb(null, record);
        } catch (err) {
          return cb(err);
        }
      },
    });
  }

  // ---------------- DB WRITER ----------------
  private dbWriter(increment: () => void) {
    return new Writable({
      objectMode: true,

      write: async (chunk: CsvRecord, _, next) => {
        try {
          await this.recordModel.create(chunk);
          increment();
          next();
        } catch (err) {
          this.logger.error(`DB insert failed: ${err.message}`);
          next();
        }
      },
    });
  }

  // =====================================================
  //                  CSV EXPORT
  // =====================================================
  async exportCsv(res: Response) {
    this.logger.log('CSV export started...');

    const records = await this.recordModel.find().lean();

    if (!records.length) {
      return res.status(200).send('name,email,age\n');
    }

    let csv = 'name,email,age\n';

    for (const r of records) {
      csv += `${r.name || ''},${r.email || ''},${r.age || ''}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');

    return res.send(csv);
  }
}
