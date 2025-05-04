import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

   

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const applicant = await db.collection('Applicants').findOne({ _id: new ObjectId(id) });

    if (!applicant) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(applicant);
  } catch (err) {
    console.error('GET /api/applicants/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
