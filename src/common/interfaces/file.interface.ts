export interface FileUploadOptions {
  filePath: string;
  destination: string;
}

export type StreamStatus =
  | 'NOT_STARTED'
  | 'READING'
  | 'WRITING'
  | 'COMPLETED'
  | 'ERROR';

export interface StreamResponse {
  status: StreamStatus;
  message: string;
  bytesProcessed?: number;
}
