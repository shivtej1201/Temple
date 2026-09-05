import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;
    if (!GOOGLE_API_KEY) {
      // Mock data fallback if no key
      return NextResponse.json({
        success: true,
        mock: true,
        results: [
          {
            id: 'mock_place_1',
            displayName: { text: `Mock Temple for ${query}` },
            formattedAddress: 'Mock Address',
            rating: 4.5,
            isVIPDarshanAvailable: true
          }
        ]
      });
    }

    // Call Google Places API (New) Text Search
    const res = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours',
        'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
      },
      body: JSON.stringify({
        textQuery: `${query} Hindu temple`
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
        where: { googlePlaceId: place.id },
        include: { festivals: { include: { festival: true } } }
      });

      return {
        ...place,
        isVIPDarshanAvailable: localTemple?.vipDarshanAvailable || false,
        festivals: localTemple?.festivals.map(f => f.festival.name) || [],
        slug: localTemple?.slug || null
      };
    }));

    return NextResponse.json({
      success: true,
      results: enhancedPlaces
    });

  } catch (error: any) {
    console.error("Temples search API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
