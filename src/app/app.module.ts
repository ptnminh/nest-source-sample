import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigurationModule } from '../config/config.module';
import { AllExceptionFilter } from '../filters/exception.filter';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [ConfigurationModule, UtilsModule],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
