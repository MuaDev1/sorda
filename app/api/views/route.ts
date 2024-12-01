import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import View from '@/models/View';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const mangaId = searchParams.get('mangaId');

    if (!mangaId) {
      return NextResponse.json({ message: 'Manga ID is required' }, { status: 400 });
    }

    // تجميع عدد المشاهدات لكل فصل وعدد المشاهدات الإجمالية
    const viewsData = await View.aggregate([
      { $match: { mangaId } },
      {
        $group: {
          _id: '$chapterId',
          views: { $sum: 1 },
        },
      },
    ]);

    // تقسيم المشاهدات الإجمالية والمشاهدات لكل فصل
    const totalViews = viewsData.reduce((sum, item) => sum + item.views, 0);
    const chapterViews = viewsData.reduce((acc, item) => {
      acc[item._id || 'manga'] = item.views;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({ totalViews, chapterViews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json({ message: 'Failed to fetch views', error }, { status: 500 });
  }
}
