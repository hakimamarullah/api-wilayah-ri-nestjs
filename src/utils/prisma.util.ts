export const getPrismaErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'P2002':
      return `Duplicate entry for attribute ${error.meta.target} of ${error.meta?.modelName}`;
    case 'P2025':
      return `${error.meta.cause} Model: ${error.meta.modelName}`;
    case 'P2003':
      return `Foreign key constraint failed on the field: ${error.meta['field_name']}`;
    default:
      return 'something went wrong';
  }
};
