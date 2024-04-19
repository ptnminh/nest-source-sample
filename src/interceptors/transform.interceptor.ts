import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataTypeEnum, FormatTimeEnum, MessageEnum } from '../constants';
import { UtilsService } from 'src/utils/utils.service';

export interface IResponse {
  success: boolean;
  message: string;
  timestamp: string;
  [key: string]: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse> {
  private __timezone: string;

  constructor(
    private readonly __configService: ConfigService,
    private readonly __utilsService: UtilsService,
  ) {
    this.__timezone = this.__configService.getOrThrow<string>('app.timezone');
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse> {
    return next.handle().pipe(
      map((response) => {
        const responseType = this.__utilsService.checkDataType(response);
        const rest =
          responseType === DataTypeEnum.OBJECT ? response : { data: response };
        return {
          success: true,
          message: response?.message || MessageEnum.SUCCESS,
          timestamp: moment()
            .tz(this.__timezone)
            .format(FormatTimeEnum.DATE_TIME),
          ...rest,
        };
      }),
    );
  }
}
