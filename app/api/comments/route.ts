import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const mangaId = url.searchParams.get('mangaId');
    const chapterId = url.searchParams.get('chapterId'); // جلب chapterId من الاستعلام

    if (!mangaId) {
      return NextResponse.json({ message: 'Manga ID is required' }, { status: 400 });
    }

    const filter: Record<string, string> = { mangaId };
    if (chapterId) {
      filter['chapterId'] = chapterId; // تصفية حسب الفصل إذا كان موجودًا
    } else {
      filter['chapterId'] = { $exists: false }; // عرض التعليقات العامة فقط إذا لم يكن هناك فصل
    }

    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch comments', error }, { status: 500 });
  }
}

// التعامل مع طلبات POST لإضافة تعليق جديد
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { mangaId, chapterId, content, author } = body;

    if (!mangaId || !content || !author || !author.userId || !author.name || !author.avatar) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const comment = await Comment.create({
      mangaId,
      chapterId, // إضافة chapterId إذا كان موجودًا
      author,
      content,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to create comment', error }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  await dbConnect();
  try {
    const { content } = await req.json();
    const commentId = req.url.split('/').pop();

    if (!content || !commentId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update comment', error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const commentId = req.url.split('/').pop();

    if (!commentId) {
      return NextResponse.json({ message: 'Missing comment ID' }, { status: 400 });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete comment', error }, { status: 500 });
  }
}
