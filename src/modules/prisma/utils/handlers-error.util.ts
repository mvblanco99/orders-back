import { Prisma } from '@prisma/client';

const handlersDbError = (
  error:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientInitializationError
    | Prisma.PrismaClientRustPanicError
    | Error,
) => {
  console.log('Error:', error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be used to filter out specific errors
    switch (error.code) {
      case 'P2002':
        // Unique constraint failed
        const target = error.meta?.target;
        return {
          status: 409,
          message: `Duplicate entry, unique constraint failed on field(s): ${target}`,
        };
      case 'P2003':
        // Foreign key constraint failed
        return {
          status: 400,
          message: 'Foreign key constraint failed.',
        };
      case 'P2025':
        // Record not found
        return {
          status: 404,
          message: 'Record not found.',
        };
      case 'P2010':
        // Invalid input
        const message = error.meta?.message;
        return {
          status: 400,
          message: 'Invalid input.' + message,
        };
      default:
        return {
          status: 500,
          message: 'An unknown error occurred.',
        };
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // Initialization error
    return {
      status: 500,
      message: 'Failed to initialize the database connection.',
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // Rust panic error
    return {
      status: 500,
      message: 'A critical error occurred in the database engine.',
    };
  } else {
    // Generic error
    return {
      status: 500,
      message: 'An unexpected error occurred.',
    };
  }
};

export default handlersDbError;
