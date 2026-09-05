import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateHaversineDistance } from '@/lib/geo/haversine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radiusKm = parseFloat(searchParams.get('radius') || '10');
    
    // Optional filters
    const isMajor = searchParams.get('major') === 'true';
    const deity = searchParams.get('deity');

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: 'Valid lat and lng are required' },
        { status: 400 }
      );
    }

    // Since we are using SQLite and don't have PostGIS, we will fetch all 
    // verified temples with coordinates and filter in memory.
    // In a production PostgreSQL app, we would use raw SQL with ST_Distance.
    
    let whereClause: any = {
      isVerified: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (isMajor) {
      whereClause.isMajor = true;
    }

    if (deity) {
      whereClause.primaryDeity = {
        name: { equals: deity, mode: 'insensitive' }
      };
    }

    const temples = await prisma.temple.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        latitude: true,
        longitude: true,
        isMajor: true,
        primaryDeity: { select: { name: true } },
        images: { take: 1, select: { url: true } }
      }
    });

    const nearbyTemples = temples
      .map(t => {
        const distanceKm = calculateHaversineDistance(
          lat,
          lng,
          t.latitude!,
          t.longitude!
        );
        return { ...t, distanceKm };
      })
      .filter(t => t.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      success: true,
      data: nearbyTemples,
      count: nearbyTemples.length
    });

  } catch (error) {
    console.error("Error fetching nearby temples:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch nearby temples" },
      { status: 500 }
    );
  }
}
