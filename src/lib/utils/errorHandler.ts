import { NextResponse } from 'next/server';

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export function handleApiError(error: unknown, fallbackMessage = "Internal Server Error"): NextResponse<ApiErrorResponse> {
  // 1. Log the full error to the server console (or external APM tool)
  console.error("[API Error Tracker]:", error);

  // 2. Sanitize error message for the client
  // Never expose raw database errors or stack traces to the frontend
  let message = fallbackMessage;
  let status = 500;
  
  if (error instanceof Error) {
    // We can conditionally pass through specific safe error messages if we create custom AppError classes
    if (error.message.includes('PrismaClientValidationError')) {
      message = "Invalid database query parameters.";
      status = 400;
    }
  }

  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}
