import { NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/api/error';
import { GooglePlacesService } from '@/services/google/places.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { encodedPolyline } = body;

    if (!encodedPolyline) {
      throw new ApiError('MISSING_POLYLINE', 'encodedPolyline is required', 400);
    }

    const results = await GooglePlacesService.searchAlongRoute(encodedPolyline);

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error: any) {
    return handleApiError(error, request);
  }
}
