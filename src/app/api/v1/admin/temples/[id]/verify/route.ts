import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In a real app, verify admin session here
    
    const temple = await prisma.temple.update({
      where: { id },
      data: { isVerified: true }
    });
    
    return NextResponse.json({ success: true, temple });
  } catch (error) {
    console.error("Failed to verify temple:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In a real app, verify admin session here
    
    const temple = await prisma.temple.update({
      where: { id },
      data: { isVerified: false }
    });
    
    return NextResponse.json({ success: true, temple });
  } catch (error) {
    console.error("Failed to unverify temple:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
