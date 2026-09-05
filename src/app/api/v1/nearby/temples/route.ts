import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radiusMeters = parseFloat(searchParams.get('radius') || '10000'); // default 10km

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: 'Valid lat and lng are required' },
        { status: 400 }
      );
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;
    if (!GOOGLE_API_KEY) {
      // Mock fallback
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'mock_nearby_1',
            name: "Mock Nearby Temple",
            distanceKm: 2.5,
            latitude: lat + 0.01,
            longitude: lng + 0.01,
            rating: 4.8
          }
        ],
        count: 1
      });
    }

    // Call Google Places API (New) Nearby Search
    const res = await fetch(`https://places.googleapis.com/v1/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours',
        'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
      },
      body: JSON.stringify({
        includedTypes: ['hindu_temple'],
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters <= 50000 ? radiusMeters : 50000 // Max 50km
          }
        },
        maxResultCount: 20
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
        id: place.id,
        name: place.displayName?.text,
        address: place.formattedAddress,
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        photos: place.photos,
        isVIPDarshanAvailable: localTemple?.vipDarshanAvailable || false,
        slug: localTemple?.slug || null
      };
    }));

    return NextResponse.json({
      success: true,
      data: enhancedPlaces,
      count: enhancedPlaces.length
    });

  } catch (error: any) {
    console.error("Error fetching nearby temples:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch nearby temples: " + error.message },
      { status: 500 }
    );
  }
}
