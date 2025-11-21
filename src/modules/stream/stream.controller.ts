import { Controller, Get, Query } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get('file')
  async streamFile(
    @Query('filePath') filePath: string,
    @Query('destination') destination: string,
  ) {
    return this.streamService.streamLargeFile(filePath, destination);
  }
}
