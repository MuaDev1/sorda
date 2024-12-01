import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function DELETE(req: Request, { params }: { params: { commentId: string } }) {
  await dbConnect();

  try {
    const { commentId } = params;

    // التحقق من صحة المعرف
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ message: 'Invalid or missing comment ID' }, { status: 400 });
    }

    // حذف التعليق من قاعدة البيانات
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Failed to delete comment', error }, { status: 500 });
  }
}
