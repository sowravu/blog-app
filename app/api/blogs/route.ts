import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper to check for authenticated user
const checkUser = async (req: Request) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded;
    } catch (error) {
        return null;
    }
};

export async function GET() {
    await dbConnect();
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate('author', 'name');
        return NextResponse.json({ success: true, data: blogs });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function POST(req: Request) {
    const user = await checkUser(req);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const blog = await Blog.create({ ...body, author: user.userId });
        return NextResponse.json({ success: true, data: blog }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
