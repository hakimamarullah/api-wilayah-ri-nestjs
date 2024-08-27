export const getPrismaErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'P2002':
      return `Duplicate entry for attribute ${error.meta.target} of ${error.meta?.modelName}`;
    case 'P2025':
      return `Record not found for ${error.meta.target}`;
    case 'P2003':
      return `Cannot delete or update a parent row: a foreign key constraint fails`;
    default:
      return 'something went wrong';
  }
};
