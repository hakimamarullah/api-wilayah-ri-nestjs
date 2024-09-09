import { HttpStatus, Logger } from '@nestjs/common';

export declare interface PrismaError {
  message: string;
  httpStatus: number;
}
export const getPrismaError = (error: any): PrismaError => {
  const logger: Logger = new Logger('PrismaErrorUtil');
  switch (error.code) {
    case 'P2002':
      return {
        message: `Duplicate entry for attribute ${error.meta.target} of ${error.meta?.modelName}`,
        httpStatus: HttpStatus.CONFLICT,
      };
    case 'P2025':
      return {
        message: `Data Not Found`,
        httpStatus: HttpStatus.NOT_FOUND,
      };
    case 'P2003':
      return {
        message: `Foreign key constraint failed on the field: ${error.meta['field_name']}`,
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    case 'P1001':
      return {
        message: 'Database connection timeout. Please try again.',
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    case 'P2024': {
      const message = error?.message?.split('\n');
      return {
        message:
          message[message.length - 1]?.trim() ??
          `error ${error.code}: ${error.message}`,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
    default:
      logger.error(error);
      return {
        message: 'something went wrong',
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      };
  }
};
