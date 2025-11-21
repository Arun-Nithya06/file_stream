import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.importCsv(file.buffer);
  }

  @Get('export')
  exportCsv(@Res() res) {
    return this.fileService.exportCsv(res);
  }
}
