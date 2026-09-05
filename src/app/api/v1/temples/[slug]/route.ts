import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const temple = await prisma.temple.findUnique({
      where: { slug: slug },
      include: {
        primaryDeity: true,
        region: true,
        state: true,
        city: true,
        images: { orderBy: { sortOrder: 'asc' } },
        timings: true,
        darshans: { where: { isActive: true } },
        festivals: { include: { festival: true } },
        events: true,
        deities: { include: { deity: true } }
      }
    });

    if (!temple) {
      return NextResponse.json(
        { success: false, error: "Temple not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: temple });
  } catch (error) {
    console.error("Error fetching temple details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch temple details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    // Check admin auth here in a real app

    const updatedTemple = await prisma.temple.update({
      where: { slug: slug },
      data: body // DANGEROUS IN PROD: Should only pick specific fields
    });

    return NextResponse.json({ success: true, data: updatedTemple });
  } catch (error) {
    console.error("Error updating temple:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update temple" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    // Check admin auth here in a real app

    await prisma.temple.delete({
      where: { slug: slug }
    });

    return NextResponse.json({ success: true, message: "Temple deleted successfully" });
  } catch (error) {
    console.error("Error deleting temple:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete temple" },
      { status: 500 }
    );
  }
}
