import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './env.validation';
import env from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
      isGlobal: true,
      validationSchema,
      validationOptions: { abortEarly: true, convert: true },
    }),
  ],
})
export class ConfigurationModule {}
