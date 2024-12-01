import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Manga from '@/models/Manga';
import Chapter from '@/models/Chapter';
import User from '@/models/User';
import Comment from '@/models/Comment';
import Like from '@/models/Like';
import View from '@/models/View';

export async function GET() {
  await dbConnect();

  try {
    const totalManga = await Manga.countDocuments();
    const totalChapters = await Chapter.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();
    const totalViews = await View.countDocuments(); // عدد المشاهدات

    return NextResponse.json({
      totalManga,
      totalChapters,
      totalUsers,
      totalComments,
      totalLikes,
      totalViews,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ message: 'Failed to fetch stats', error }, { status: 500 });
  }
}
