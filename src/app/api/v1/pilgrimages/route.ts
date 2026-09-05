import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const pilgrimages = await prisma.pilgrimage.findMany({
      where: { isOfficial: true },
      include: {
        deity: true,
        region: true,
        temples: {
          orderBy: { sequence: 'asc' },
          include: { temple: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: pilgrimages });
  } catch (error) {
    console.error("Error fetching pilgrimages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pilgrimages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newPilgrimage = await prisma.pilgrimage.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        difficulty: body.difficulty,
        durationDays: body.durationDays,
        isOfficial: true,
      }
    });

    return NextResponse.json({ success: true, data: newPilgrimage }, { status: 201 });
  } catch (error) {
    console.error("Error creating pilgrimage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create pilgrimage" },
      { status: 500 }
    );
  }
}
