import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Assuming the URL format is /api/users/[id]

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const applicant = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!applicant) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(applicant);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
