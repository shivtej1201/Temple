import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { encodedPolyline } = body;

    if (!encodedPolyline) {
      return NextResponse.json({ success: false, error: 'encodedPolyline is required' }, { status: 400 });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;
    if (!GOOGLE_API_KEY) {
      // Mock data fallback
      return NextResponse.json({
        success: true,
        mock: true,
        results: [
          {
            id: 'mock_route_place',
            name: 'Mock Temple Along Route',
            rating: 4.5,
            isVIPDarshanAvailable: true
          }
        ]
      });
    }

    // Call Google Places API (New) Text Search with Search Along Route
    const res = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
        'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
      },
      body: JSON.stringify({
        textQuery: `Hindu temple`,
        searchAlongRouteParameters: {
          polyline: {
            encodedPolyline: encodedPolyline
          }
        }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Places API error');
    }

    const places = data.places || [];

    // Optional: Enhance with our local DB intelligence
    const enhancedPlaces = await Promise.all(places.map(async (place: any) => {
      const localTemple = await prisma.temple.findFirst({
        where: { googlePlaceId: place.id }
      });

      return {
        id: place.id,
        name: place.displayName?.text,
        address: place.formattedAddress,
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        isVIPDarshanAvailable: localTemple?.vipDarshanAvailable || false,
        slug: localTemple?.slug || null
      };
    }));

    return NextResponse.json({
      success: true,
      results: enhancedPlaces
    });

  } catch (error: any) {
    console.error("Temples route search API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
