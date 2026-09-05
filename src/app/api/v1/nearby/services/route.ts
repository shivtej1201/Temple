import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const type = searchParams.get('type') || 'lodging'; // 'lodging' or 'restaurant'

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: 'Valid lat and lng are required' }, { status: 400 });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;
    if (!GOOGLE_API_KEY) {
      // Mock data if no key is provided
      return NextResponse.json({
        success: true,
        mock: true,
        results: [
          { id: "mock_1", name: type === 'lodging' ? "Yatri Nivas" : "Prasad Bhojnalaya", vicinity: "1 km away", rating: 4.5, user_ratings_total: 120, type },
          { id: "mock_2", name: type === 'lodging' ? "Temple View Hotel" : "Pure Veg Family Restaurant", vicinity: "2 km away", rating: 4.0, user_ratings_total: 80, type },
        ]
      });
    }

    // Call Google Places API Nearby Search
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${GOOGLE_API_KEY}`);
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || 'Places API error');
    }

    return NextResponse.json({
      success: true,
      results: data.results.map((r: any) => ({
        id: r.place_id,
        name: r.name,
        vicinity: r.vicinity,
        rating: r.rating,
        user_ratings_total: r.user_ratings_total,
        type: type
      }))
    });

  } catch (error: any) {
    console.error("Nearby services API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
