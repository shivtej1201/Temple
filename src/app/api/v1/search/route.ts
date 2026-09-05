import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: { temples: [], festivals: [], pilgrimages: [], regions: [] } });
    }

    const [temples, festivals, pilgrimages, regions] = await Promise.all([
      prisma.temple.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { city: { name: { contains: q } } },
            { state: { name: { contains: q } } },
            { primaryDeity: { name: { contains: q } } }
          ]
        },
        take: 5,
        include: { city: true, primaryDeity: true }
      }),
      prisma.festival.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { deity: { name: { contains: q } } }
          ]
        },
        take: 3
      }),
      prisma.pilgrimage.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } }
          ]
        },
        take: 3
      }),
      prisma.region.findMany({
        where: {
          name: { contains: q }
        },
        take: 3
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      data: {
        temples,
        festivals,
        pilgrimages,
        regions
      }
    });
  } catch (error) {
    console.error("Error performing global search:", error);
    return NextResponse.json({ success: false, error: 'Failed to perform search' }, { status: 500 });
  }
}
