// app/api/categories/[category]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Manga from '@/models/Manga';

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    await dbConnect();

    // ابحث عن المانجات التي تحتوي على التصنيف المطلوب
    const mangas = await Manga.find({ categories: params.category });

    if (!mangas || mangas.length === 0) {
      return NextResponse.json({ message: 'No mangas found for this category' }, { status: 404 });
    }

    return NextResponse.json(mangas);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
