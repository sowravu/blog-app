import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// dbConnect alias to match my implementation in lib/db.ts, I should check if I named it db or dbConnect
// Checking lib/db.ts content... it was exported as default dbConnect.
// But file name is lib/db.ts. So import should be from '@/lib/db'.

import dbConnectRaw from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide all fields' },
                { status: 400 }
            );
        }

        await dbConnectRaw();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Server Error' },
            { status: 500 }
        );
    }
}
