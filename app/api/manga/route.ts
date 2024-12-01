import dbConnect from '@/lib/mongodb';
import Manga from '@/models/Manga';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger'; // استيراد وحدة التسجيل

// GET: Fetch all manga
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const author = searchParams.get('author'); // جلب اسم المؤلف من الاستعلام

    // إنشاء استعلام لجلب المانجا بناءً على اسم المؤلف
    const query = author ? { author } : {};
    const mangas = await Manga.find(query);

    return NextResponse.json(mangas);
  } catch (error) {
    console.error('Error fetching manga:', error);
    return NextResponse.json({ message: 'Error fetching manga' }, { status: 500 });
  }
}

// POST: Add a new manga
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { title, author, description, categories, imageUrl, publisher } = await request.json();

    if (!title || !author || !description || !categories || !imageUrl || !publisher) {
      logger.warn('Attempted to create manga with missing fields');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newManga = new Manga({ title, author, description, categories, imageUrl, publisher });
    await newManga.save();

    logger.info(`Manga created successfully: ${title} by ${publisher.name}`);
    return NextResponse.json(newManga, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error creating manga: ${error.message}`);
    } else {
      logger.error('Error creating manga: Unknown error occurred');
    }
    return NextResponse.json({ message: 'Error creating manga' }, { status: 500 });
  }
}

// PUT: Update an existing manga
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { _id, title, author, description, categories, imageUrl } = await request.json();

    const updatedManga = await Manga.findByIdAndUpdate(
      _id,
      { title, author, description, categories, imageUrl },
      { new: true }
    );

    if (!updatedManga) {
      logger.warn(`Attempted to update non-existent manga: ${_id}`);
      return NextResponse.json({ message: 'Manga not found' }, { status: 404 });
    }

    logger.info(`Manga updated successfully: ${title}`);
    return NextResponse.json(updatedManga);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating manga: ${error.message}`);
    } else {
      logger.error('Error updating manga: Unknown error occurred');
    }
    return NextResponse.json({ message: 'Error updating manga' }, { status: 500 });
  }
}

// DELETE: Delete a manga
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const deletedManga = await Manga.findByIdAndDelete(id);
    if (!deletedManga) {
      logger.warn(`Attempted to delete non-existent manga: ${id}`);
      return NextResponse.json({ message: 'Manga not found' }, { status: 404 });
    }

    logger.info(`Manga deleted successfully: ${id}`);
    return NextResponse.json({ message: 'Manga deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error deleting manga: ${error.message}`);
    } else {
      logger.error('Error deleting manga: Unknown error occurred');
    }
    return NextResponse.json({ message: 'Error deleting manga' }, { status: 500 });
  }
}
