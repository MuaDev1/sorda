import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const mangaId = url.searchParams.get('mangaId');
    const chapterId = url.searchParams.get('chapterId');

    // التحقق من وجود mangaId للتصفية
    if (!mangaId) {
      return NextResponse.json({ message: 'Manga ID is required' }, { status: 400 });
    }

    // إنشاء الفلتر بناءً على المعايير المحددة
    const filter: Record<string, any> = { mangaId };
    if (chapterId) {
      filter.chapterId = chapterId; // تصفية بناءً على الفصل إذا تم تحديده
    } else {
      filter.chapterId = { $exists: false }; // عرض التعليقات العامة فقط إذا لم يتم تحديد الفصل
    }

    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Failed to fetch comments', error }, { status: 500 });
  }
}
