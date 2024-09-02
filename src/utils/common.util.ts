import { BaseResponse } from '../dto/baseResponse.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { HttpStatus } from '@nestjs/common';
import { getPrismaError, PrismaError } from './prisma.util';
import * as crypto from 'crypto';

/**
 * Translate a Prisma error into a BaseResponse object.
 *
 * @param err The error from Prisma.
 * @param defaultMessage The default message to use if the error is not a
 *                        PrismaClientKnownRequestError or
 *                        PrismaClientValidationError.
 * @returns A BaseResponse object containing the translated error.
 */
export const translatePrismaError = (err: Error, defaultMessage: string) => {
  const response: BaseResponse<any> = new BaseResponse();
  response.responseMessage = defaultMessage;
  switch (err.name) {
    case PrismaClientKnownRequestError.name: {
      const prismaErr: PrismaError = getPrismaError(err);
      response.responseCode = prismaErr.httpStatus;
      response.responseData = prismaErr.message;
      break;
    }
    case PrismaClientValidationError.name: {
      response.responseCode = HttpStatus.BAD_REQUEST;
      const messages = err.message.split('\n');
      response.responseData =
        messages[messages.length - 1]?.trim() ??
        PrismaClientValidationError.name;
      break;
    }
    default:
      response.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
      break;
  }
  return response;
};

/**
 * Generate a random API key.
 *
 * The API key is a 256-bit (32-byte) AES key, represented as a hexadecimal
 * string. The key is generated using the `crypto` module's `generateKeySync`
 * method, which generates a cryptographically secure random key.
 *
 * @returns The generated API key, as a hexadecimal string.
 */

export const generateApiKey = (): string => {
  return crypto
    .generateKeySync('aes', { length: 256 })
    .export()
    .toString('hex');
};

/**
 * Add a specified number of days to the given date.
 *
 * @param date The date to which to add the days.
 * @param days The number of days to add.
 * @returns A new `Date` object, which is the result of adding
 * `days` to `date`.
 */

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculate a date 30 days from now.
 *
 * @returns A new `Date` object, which is 30 days from the current date.
 */

export const next30Days = () => {
  return addDays(new Date(), 30);
};
