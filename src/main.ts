import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('Initializing NestJS application...');

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    const port = process.env.PORT ?? 3000;

    await app.listen(port);

    logger.log(`Application started successfully`);
    logger.log(`Running on http://localhost:${port}`);
    logger.debug(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
  } catch (error) {
    logger.error(' Failed to start application', error.stack);
    process.exit(1);
  }

  process.on('SIGTERM', () => {
    const logger = new Logger('Shutdown');
    logger.warn('SIGTERM received… closing application');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    const logger = new Logger('Shutdown');
    logger.warn('SIGINT received… closing application');
    process.exit(0);
  });
}

bootstrap();
