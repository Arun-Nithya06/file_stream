import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import { StreamResponse } from 'src/common/interfaces/file.interface';

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name);

  async streamLargeFile(
    filePath: string,
    destination: string,
  ): Promise<StreamResponse> {
    this.logger.log(`Starting file streaming...`);
    this.logger.debug(`Source: ${filePath}, Destination: ${destination}`);

    try {
      const readStream = createReadStream(filePath);
      const writeStream = createWriteStream(destination);

      let bytes = 0;

      readStream.on('data', (chunk) => {
        bytes += chunk.length;
      });

      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);

        writeStream.on('finish', () => {
          this.logger.log(
            `Streaming completed. Total bytes processed: ${bytes}`,
          );
          resolve(null);
        });

        writeStream.on('error', (err) => {
          this.logger.error(`Write stream failed: ${err.message}`, err.stack);
          reject(err);
        });

        readStream.on('error', (err) => {
          this.logger.error(`Read stream failed: ${err.message}`, err.stack);
          reject(err);
        });
      });

      return {
        status: 'COMPLETED',
        message: 'File streamed successfully!',
        bytesProcessed: bytes,
      };
    } catch (error) {
      this.logger.error(`File streaming failed: ${error.message}`, error.stack);

      return {
        status: 'ERROR',
        message: error.message,
      };
    }
  }
}
