import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    // Simple check for admin would be good here too, reusing the logic or middleware
    // For now assuming middleware protects this if used in /admin context or we duplicate check

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Cloudinary using stream or buffer
        // Since cloudinary node sdk expects a buffer or path, we can stick to a promise wrapper

        const results = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'blog-app' },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ success: true, data: results }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
