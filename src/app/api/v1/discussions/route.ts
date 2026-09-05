import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'latest';
    const searchQuery = searchParams.get('search');

    const whereClause: any = { status: 'PUBLISHED' };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery } },
        { content: { contains: searchQuery } }
      ];
    }

    // Category mapping logic if we had formal categories, 
    // for now we'll just search by text if category is provided and not 'All Discussions'
    if (category && category !== 'All Discussions') {
       if (!whereClause.OR) whereClause.OR = [];
       whereClause.OR.push({ title: { contains: category } });
       whereClause.OR.push({ content: { contains: category } });
    }

    let orderBy: any = { createdAt: 'desc' };
    
    if (sort === 'trending') {
      orderBy = [
        { replyCount: 'desc' },
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ];
    } else if (sort === 'popular') {
      orderBy = [
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ];
    }

    const threads = await prisma.thread.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      },
      orderBy,
      take: 50
    });

    return NextResponse.json({ success: true, data: threads });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch discussions' }, { status: 500 });
  }
}
