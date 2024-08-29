import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { BaseResponse } from '../../../dto/baseResponse.dto';

export function ApiBaseResponse<T extends Type<any>>(
  model: T,
  isArray: boolean = false,
) {
  return applyDecorators(
    ApiExtraModels(
      () => BaseResponse,
      () => model,
    ),
    ApiResponse({
      status: 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse.name) },
          {
            properties: {
              responseData: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model.name) },
                  }
                : { $ref: getSchemaPath(model.name) },
            },
          },
        ],
      },
    }),
  );
}
