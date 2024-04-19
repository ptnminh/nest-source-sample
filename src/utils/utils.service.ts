import { Injectable } from '@nestjs/common';
import {
  camelCase,
  includes,
  isObject,
  map,
  mapKeys,
  mapValues,
  snakeCase,
} from 'lodash';
import { VariableTypeEnum } from '../constants';

@Injectable()
export class UtilsService {
  checkDataType(value: any) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  }

  transformVariableType({
    object,
    depth = Infinity,
    type = VariableTypeEnum.CAMEL_CASE,
    ignoreFields = [],
  }: {
    object: any;
    depth?: number;
    type?: string;
    ignoreFields?: Array<string>;
  }): any {
    if (depth === 0) {
      return object;
    }
    if (Array.isArray(object)) {
      return map(object, (value: any) => {
        if (!isObject(value)) {
          return value;
        }
        return this.transformVariableType({
          depth: depth - 1,
          object: value,
          type,
          ignoreFields,
        });
      });
    }
    const finalObj = mapKeys(object, (v, k) =>
      !includes(ignoreFields, k)
        ? type === VariableTypeEnum.CAMEL_CASE
          ? camelCase(k)
          : snakeCase(k)
        : k,
    );
    return mapValues(finalObj, (value: any) => {
      if (!isObject(value)) {
        return value;
      }
      return this.transformVariableType({
        depth: depth - 1,
        object: value,
        type,
        ignoreFields,
      });
    });
  }
}
