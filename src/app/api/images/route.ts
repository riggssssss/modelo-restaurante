import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'public/library');

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function GET() {
    try {
        const files = fs.readdirSync(UPLOAD_DIR);
        // Filter for images only
        const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));

        const imageUrls = images.map(file => ({
            name: file,
            url: `/library/${file}`,
            path: path.join(UPLOAD_DIR, file)
        }));

        return NextResponse.json({ images: imageUrls });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filepath = path.join(UPLOAD_DIR, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            image: {
                name: filename,
                url: `/library/${filename}`
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filename = searchParams.get('name');

        if (!filename) {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        const filepath = path.join(UPLOAD_DIR, filename);

        if (fs.existsSync(filepath)) {
            await unlink(filepath);
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
