import { NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/api/error';
import { GooglePlacesService } from '@/services/google/places.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      throw new ApiError('MISSING_QUERY', 'Query is required', 400);
    }

    const results = await GooglePlacesService.searchTemples(query);

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error: any) {
    return handleApiError(error, request);
  }
}
