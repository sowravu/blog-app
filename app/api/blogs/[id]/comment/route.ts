import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await checkUser(req);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
        }

        await dbConnect();

        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        blog.comments.push({
            user: user.userId,
            text,
            createdAt: new Date(),
        });

        await blog.save();

        // Populate the new comment with user details before returning
        await blog.populate('comments.user', 'name');

        return NextResponse.json({ success: true, comments: blog.comments });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
