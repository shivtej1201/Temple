import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const festival = await prisma.festival.findUnique({
      where: { slug },
      include: {
        temples: {
          include: { 
            temple: {
              select: {
                id: true,
                name: true,
                slug: true,
                latitude: true,
                longitude: true,
                city: { select: { name: true } }
              }
            } 
          },
          orderBy: { importance: 'desc' },
          take: limit
        }
      }
    });

    if (!festival) {
      return NextResponse.json({ success: false, error: 'Festival not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      festival: {
        name: festival.name,
        slug: festival.slug
      },
      recommendations: festival.temples.map(t => ({
        ...t.temple,
        importance: t.importance,
        specialEvent: t.specialEvent
      }))
    });

  } catch (error: any) {
    console.error("Festival recommendations API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
