import { NextResponse } from 'next/server';
import { logger } from './logger';

export class ApiError extends Error {
  public code: string;
  public status: number;

  constructor(code: string, message: string, status: number = 400) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown, req?: Request) {
  const path = req ? new URL(req.url).pathname : 'unknown';
  
  if (error instanceof ApiError) {
    logger.warn(`API Error [${error.code}] at ${path}: ${error.message}`);
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    }, { status: error.status });
  }

  // Handle generic errors (e.g. Prisma or runtime)
  const isProd = process.env.NODE_ENV === 'production';
  const message = error instanceof Error ? error.message : 'Unknown internal server error';
  
  logger.error(`Unhandled Error at ${path}: ${message}`, error);

  return NextResponse.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'An unexpected error occurred' : message
    }
  }, { status: 500 });
}
