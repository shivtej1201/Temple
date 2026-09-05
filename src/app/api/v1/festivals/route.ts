import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isMajor = searchParams.get('isMajor') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;

  try {
    const festivals = await prisma.festival.findMany({
      where: {
        ...(searchParams.has('isMajor') ? { isMajor } : {})
      },
      include: {
        deity: true
      },
      take: limit,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: festivals });
  } catch (error) {
    console.error("Error fetching festivals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch festivals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, validate body with Zod and check admin authentication here

    const newFestival = await prisma.festival.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        deityId: body.deityId,
        isMajor: body.isMajor || false,
      }
    });

    return NextResponse.json({ success: true, data: newFestival }, { status: 201 });
  } catch (error) {
    console.error("Error creating festival:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create festival" },
      { status: 500 }
    );
  }
}
