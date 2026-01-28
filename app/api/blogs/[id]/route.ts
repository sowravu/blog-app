import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper to verify Admin
const verifyAdmin = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return false;

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded.role === 'admin';
    } catch (error) {
        return false;
    }
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;

    try {
        const blog = await Blog.findById(id).populate('author', 'name');
        if (!blog) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await verifyAdmin();
    const { id } = await params;

    if (!isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const blog = await Blog.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!blog) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await verifyAdmin();
    const { id } = await params;

    if (!isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const deletedBlog = await Blog.deleteOne({ _id: id });
        if (!deletedBlog) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
