// app/api/manga/[mangaId]/chapter/route.ts
import dbConnect from '@/lib/mongodb';
import Manga from '@/models/Manga';
import Chapter from '@/models/Chapter';
import { NextResponse } from 'next/server';

// POST: Add a new chapter to a manga
export async function POST(request: Request, { params }: { params: { mangaId: string } }) {
  try {
    await dbConnect();
    const { title, number, images } = await request.json();

    if (!title || !number || !images) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newChapter = new Chapter({
      title,
      number,
      images,
      manga: params.mangaId,
    });

    const savedChapter = await newChapter.save();

    // إضافة الفصل إلى المانجا
    await Manga.findByIdAndUpdate(params.mangaId, {
      $push: { chapters: savedChapter._id },
    });

    return NextResponse.json(savedChapter, { status: 201 });
  } catch (error) {
    return new NextResponse('Error creating chapter', { status: 500 });
  }
}
