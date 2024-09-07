import { BaseResponse } from '../dto/baseResponse.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { HttpStatus, Logger } from '@nestjs/common';
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

/**
 * Converts a wildcard pattern to a regular expression.
 * @param pattern The wildcard pattern (e.g., '/api/somepath/*')
 * @returns A regular expression that matches the pattern.
 */
export const convertPatternToRegExp = async (
  pattern: string,
): Promise<RegExp> => {
  const escapedPattern = pattern
    .replace(/([.*+?^${}()|[\]\\])/g, '\\$1') // Escape special characters
    .replace(/:\w+/g, '\\w+') // Convert ':id' or ':parameter' to '\d+' for numeric values
    .replace(/\\\*/g, '.*') // Replace '*' with '.*'
    .replace(/\\\?/g, '.') // Optionally replace '?' with '.'
    .replace(/\\\[/g, '[') // Unescape '[' for character classes
    .replace(/\\]/g, ']') // Unescape ']' for character classes
    .replace(/\\\(/g, '(') // Unescape '(' for capturing groups if needed
    .replace(/\\\)/g, ')'); // Unescape ')' for capturing groups if needed

  // Return a RegExp object with anchors to match the entire string
  return new RegExp(`^${escapedPattern}$`);
};

export const convertTo = async <T>(
  data: { [keyName: string]: string[] },
  transformer: (value: any) => Promise<T>,
): Promise<{ [keyName: string]: T[] }> => {
  const logger = new Logger('CommonUtil.ConvertTo');
  // Create a new object to store the results
  const result: { [keyName: string]: T[] } = {};

  // Iterate over each key in the input data
  for (const keyName of Object.keys(data)) {
    // Map each string pattern to its transformed value
    const transformedArray = await Promise.all(
      data[keyName].map(async (patternString) => {
        try {
          return await transformer(patternString);
        } catch (e) {
          logger.error(
            `Error transforming pattern string: ${patternString}`,
            e,
          );
          return null; // Exclude any failed transformations
        }
      }),
    ).then((arr) => arr.filter((item) => item !== null)); // Filter out null values

    // Add the transformed array to the result object
    result[keyName] = transformedArray as T[];
  }

  return result;
};
