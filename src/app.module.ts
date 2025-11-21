import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { StreamModule } from './modules/stream/stream.module';
import { FileModule } from './modules/file/file.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [DatabaseModule, StreamModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
