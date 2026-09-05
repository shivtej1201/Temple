import { NextResponse } from 'next/server';
import { searchWeb } from '@/services/serp.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const location = searchParams.get('location') || 'India';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const results = await searchWeb(query, location);
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error('SerpAPI Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}
