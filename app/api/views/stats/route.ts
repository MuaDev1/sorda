import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import View from '@/models/View';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const mangaId = url.searchParams.get('mangaId');

    if (!mangaId) {
      return NextResponse.json({ message: 'Manga ID is required' }, { status: 400 });
    }

    const chapterViews = await View.aggregate([
      { $match: { mangaId } },
      {
        $group: {
          _id: '$chapterId',
          views: { $sum: 1 },
        },
      },
    ]);

    const totalViews = await View.countDocuments({ mangaId });

    return NextResponse.json({ totalViews, chapterViews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching view stats:', error);
    return NextResponse.json({ message: 'Failed to fetch stats', error }, { status: 500 });
  }
}
