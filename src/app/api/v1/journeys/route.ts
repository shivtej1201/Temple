import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, startDate, endDate, templeIds } = body;

    if (!name || !Array.isArray(templeIds) || templeIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const journey = await prisma.userJourney.create({
      data: {
        userId: session.user.id,
        name,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'PLANNED',
        stops: {
          create: templeIds.map((templeId: string, index: number) => ({
            templeId,
            sequence: index + 1
          }))
        }
      },
      include: {
        stops: true
      }
    });

    return NextResponse.json({ success: true, journey });
  } catch (error: any) {
    console.error("Create journey error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
