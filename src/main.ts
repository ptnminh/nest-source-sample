import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const mainLogger = new Logger('Main');
  const configService = app.get(ConfigService);
  const appPort = configService.get('app.port');
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();

  // validate class-validator with nestjs DI
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(appPort);
  mainLogger.log(`Application listening on port ${await app.getUrl()}`);
}
bootstrap();
