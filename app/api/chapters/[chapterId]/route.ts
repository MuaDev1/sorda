import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';

// GET: Fetch a single chapter by ID
export async function GET(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    await dbConnect();
    const chapter = await Chapter.findById(params.chapterId);
    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }
    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json({ message: 'Error fetching chapter', error }, { status: 500 });
  }
}

// PUT: Update a chapter by ID
export async function PUT(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    await dbConnect();

    const { title, number, images, isPrivate, allowedUsers } = await request.json();

    if (!title || !number || !images) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(
      params.chapterId,
      { title, number, images, isPrivate, allowedUsers: isPrivate ? allowedUsers || [] : [] },
      { new: true }
    );

    if (!updatedChapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json({ message: 'Error updating chapter', error }, { status: 500 });
  }
}
