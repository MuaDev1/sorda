import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Like from '@/models/Like';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const mangaId = url.searchParams.get('mangaId');
    const chapterId = url.searchParams.get('chapterId'); // لجلب اللايكات للفصل (اختياري)

    if (!mangaId) {
      return NextResponse.json({ message: 'Manga ID is required' }, { status: 400 });
    }

    const filter: Record<string, string> = { mangaId };
    if (chapterId) filter['chapterId'] = chapterId;

    const likes = await Like.find(filter);
    return NextResponse.json(likes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch likes', error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId, mangaId, chapterId } = await req.json();

    if (!userId || !mangaId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // التحقق من وجود اللايك
    const existingLike = await Like.findOne({ userId, mangaId, chapterId });
    if (existingLike) {
      // حذف اللايك إذا كان موجودًا (إلغاء الإعجاب)
      await Like.findByIdAndDelete(existingLike._id);
      return NextResponse.json({ message: 'Like removed' }, { status: 200 });
    }
    
    // إضافة لايك جديد
    const like = await Like.create({ userId, mangaId, chapterId });
    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save like', error }, { status: 500 });
  }
}
