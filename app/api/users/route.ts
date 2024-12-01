// app/api/users/route.ts
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    await dbConnect();
    const users = await User.find({});
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // الحصول على الـ id من مسار الـ URL
    if (!id) {
        return new Response('User ID not provided', { status: 400 });
    }

    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        return new Response('User not found', { status: 404 });
    }

    return new Response('User deleted', {
        status: 200,
    });
}
