import { NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/api/error';
import { GooglePlacesService } from '@/services/google/places.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radiusMeters = parseFloat(searchParams.get('radius') || '10000');

    if (isNaN(lat) || isNaN(lng)) {
      throw new ApiError('INVALID_COORDINATES', 'Valid lat and lng are required', 400);
    }

    const data = await GooglePlacesService.findNearbyTemples(lat, lng, radiusMeters);

    return NextResponse.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error: any) {
    return handleApiError(error, request);
  }
}
