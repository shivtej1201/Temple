import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('year');
  const regionParam = searchParams.get('region');
  const deityParam = searchParams.get('deity');

  try {
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const whereClause: any = { year };

    if (regionParam && regionParam !== 'All Regions') {
      whereClause.region = {
        name: { contains: regionParam }
      };
    }

    if (deityParam && deityParam !== 'All Deities') {
      whereClause.festival = {
        ...whereClause.festival,
        deity: {
          name: { contains: deityParam }
        }
      };
    }

    const occurrences = await prisma.festivalOccurrence.findMany({
      where: whereClause,
      include: {
        festival: {
          include: {
            deity: true
          }
        },
        region: true
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    return NextResponse.json({ success: true, data: occurrences });
  } catch (error) {
    console.error("Error fetching festivals:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch festivals' }, { status: 500 });
  }
}
