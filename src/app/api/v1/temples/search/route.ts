import { NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/api/error';
import { GooglePlacesService } from '@/services/google/places.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      throw new ApiError('MISSING_QUERY', 'Query is required', 400);
    }

    const results = await GooglePlacesService.searchTemples(query);

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error: any) {
    return handleApiError(error, request);
  }
}
