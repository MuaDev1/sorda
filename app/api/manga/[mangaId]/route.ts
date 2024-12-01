import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Manga from '@/models/Manga';
import Chapter from '@/models/Chapter';

// GET: Fetch manga details along with its chapters
export async function GET(req: Request, { params }: { params: { mangaId: string } }) {
  try {
    await dbConnect();
    
    // ابحث عن المانجا باستخدام المعرف
    const manga = await Manga.findById(params.mangaId);
    
    if (!manga) {
      return new Response(JSON.stringify({ message: 'Manga not found' }), { status: 404 });
    }
    
    // ابحث عن الفصول المرتبطة بالمانجا
    const chapters = await Chapter.find({ mangaId: params.mangaId });
    
    // إرسال المانجا والفصول المرتبطة بها
    return new Response(JSON.stringify({ ...manga.toObject(), chapters }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// PUT: Update manga details
export async function PUT(req: Request, { params }: { params: { mangaId: string } }) {
  try {
    const { title, author, description, categories, imageUrl } = await req.json();

    await dbConnect();
    const updatedManga = await Manga.findByIdAndUpdate(
      params.mangaId,
      { title, author, description, categories, imageUrl },
      { new: true }
    );

    if (!updatedManga) {
      return NextResponse.json({ message: 'Manga not found' }, { status: 404 });
    }

    return NextResponse.json(updatedManga);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating manga' }, { status: 500 });
  }
}

// DELETE: Delete a manga
export async function DELETE(req: Request, { params }: { params: { mangaId: string } }) {
  try {
    await dbConnect();
    const deletedManga = await Manga.findByIdAndDelete(params.mangaId);

    if (!deletedManga) {
      return NextResponse.json({ message: 'Manga not found' }, { status: 404 });
    }

    // Delete associated chapters as well
    await Chapter.deleteMany({ mangaId: params.mangaId });

    return NextResponse.json({ message: 'Manga and its chapters deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting manga' }, { status: 500 });
  }
}
