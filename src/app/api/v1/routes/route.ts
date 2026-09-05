import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin, destination, travelMode } = body;

    // We proxy this to avoid exposing our SERVER_KEY to the browser
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;

    if (!GOOGLE_API_KEY) {
      // Return a mock response for development without a key
      return NextResponse.json({
        success: true,
        mock: true,
        routes: [
          {
            distanceMeters: 45000,
            duration: "3600s",
            polyline: {
              encodedPolyline: "mock_encoded_polyline_xyz"
            }
          }
        ]
      });
    }

    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng
            }
          }
        },
        travelMode: travelMode || 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to compute route');
    }

    return NextResponse.json({
      success: true,
      routes: data.routes
    });

  } catch (error: any) {
    console.error("Route API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
