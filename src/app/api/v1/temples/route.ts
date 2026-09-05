import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const revalidate = 3600; // Cache this route segment for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const type = searchParams.get('type');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 20;

  try {
    const temples = await prisma.temple.findMany({
      where: {
        isVerified: true,
        ...(region ? { region: { slug: region } } : {}),
        ...(type ? { templeType: type } : {})
      },
      include: {
        primaryDeity: true,
        region: true
      },
      take: limit,
      orderBy: { isFeatured: 'desc' }
    });

    return NextResponse.json({ success: true, data: temples });
  } catch (error) {
    console.error("Error fetching temples:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch temples" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, validate body with Zod and check admin authentication here

    const newTemple = await prisma.temple.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        
        templeType: body.templeType,
        isVerified: false // Default to false pending verification
      }
    });

    return NextResponse.json({ success: true, data: newTemple }, { status: 201 });
  } catch (error) {
    console.error("Error creating temple:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create temple" },
      { status: 500 }
    );
  }
}
