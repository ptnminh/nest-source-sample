import * as Joi from 'joi';
import { EnvironmentEnum } from '../constants';

const defaultAppName = 'app_name';

export const validationSchema = Joi.object({
  // Common
  NODE_ENV: Joi.string().default(EnvironmentEnum.DEVELOPMENT),
  APP_NAME: Joi.string().default(defaultAppName),
  APP_HOST: Joi.string().default('localhost'),
  APP_PORT: Joi.number().default(3004),
  TIMEZONE: Joi.string().default('Asia/Ho_Chi_Minh'),
});
