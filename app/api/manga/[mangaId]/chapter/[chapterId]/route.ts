// app/api/manga/[mangaId]/chapter/[chapterId]/route.ts
import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import { NextResponse } from 'next/server';

// GET: Fetch a single chapter by ID
export async function GET(request: Request, { params }: { params: { mangaId: string, chapterId: string } }) {
  try {
    await dbConnect();
    const chapter = await Chapter.findById(params.chapterId);

    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    return new NextResponse('Error fetching chapter', { status: 500 });
  }
}
