// app/api/check-admin/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    await dbConnect();

    const admin = await Admin.findOne({ userId });

    return NextResponse.json({ isAdmin: !!admin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false, error: 'Error fetching admin status' });
  }
}
