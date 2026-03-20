import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const checkAdmin = async (req: Request) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded.role !== 'admin') return null;
        return decoded;
    } catch (error) {
        return null;
    }
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const admin = await checkAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Prevent self-blocking
        if (user._id.toString() === admin.userId) {
            return NextResponse.json({ message: 'Cannot block yourself' }, { status: 400 });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
