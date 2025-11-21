import { TransformCallback } from 'stream';

export type CsvTransformChunk = Buffer | string;

export interface CsvRecord {
  name?: string | null;
  email?: string | null;
  age?: number | null;
}

export type JsonTransformCallback = (
  error: Error | null,
  data?: string | Buffer,
) => void;

export type CsvTransformFn = (
  chunk: CsvTransformChunk,
  encoding: BufferEncoding,
  callback: TransformCallback,
) => void;
