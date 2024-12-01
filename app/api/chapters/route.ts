import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import { NextResponse } from 'next/server';

// GET: Fetch all chapters
export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const mangaId = url.searchParams.get('mangaId'); // البحث عن الفصول التي تنتمي إلى مانجا معينة

    let chapters;
    if (mangaId) {
      chapters = await Chapter.find({ mangaId });
    } else {
      chapters = await Chapter.find({});
    }

    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching chapters' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    await dbConnect();

    // قراءة البيانات المرسلة
    const { title, number, images, mangaId, isPrivate, allowedUsers } = await request.json();

    // تحقق من الحقول المطلوبة
    if (!title || !number || !images || !mangaId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // تحقق من وجود `allowedUsers`
    if (!allowedUsers || !Array.isArray(allowedUsers) || allowedUsers.length === 0) {
      return NextResponse.json({ message: 'Allowed users must be specified and not empty' }, { status: 400 });
    }

    // إنشاء الفصل
    const newChapter = new Chapter({
      title,
      number,
      images,
      mangaId,
      isPrivate,
      allowedUsers, // إضافة قائمة المستخدمين المسموح لهم
    });

    await newChapter.save();
    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json({ message: 'Error creating chapter', error }, { status: 500 });
  }
}

// PUT: Update an existing chapter
export async function PUT(request: Request) {
  try {
    await dbConnect();

    // استخراج البيانات من الطلب
    const data = await request.json();
    console.log('Received data:', data); // التحقق من البيانات المستلمة
    const { _id, title, number, images, isPrivate, password } = data;

    // التحقق من وجود الحقول المطلوبة
    if (!_id || !title || !number || !images) {
      console.error('Missing fields:', { _id, title, number, images, isPrivate, password });
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // التحديث في قاعدة البيانات
    const updatedChapter = await Chapter.findByIdAndUpdate(
      _id,
      { title, number, images, isPrivate, password: isPrivate ? password : null }, // تعيين كلمة مرور إذا كان الفصل خاصًا
      { new: true } // إعادة الوثيقة بعد التحديث
    );

    if (!updatedChapter) {
      console.error('Chapter not found with ID:', _id);
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    console.log('Updated Chapter:', updatedChapter); // طباعة النتيجة لتأكيد التحديث
    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json({ message: 'Error updating chapter', error }, { status: 500 });
  }
}

// DELETE: Delete a chapter
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // الحصول على معرف الفصل من استعلام الـ URL

    if (!id) {
      return NextResponse.json({ message: 'Chapter ID is required' }, { status: 400 });
    }

    const deletedChapter = await Chapter.findByIdAndDelete(id);
    if (!deletedChapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting chapter' }, { status: 500 });
  }
}
