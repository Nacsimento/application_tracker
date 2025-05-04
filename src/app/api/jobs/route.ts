import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description , location , type , salary } = body;

    if (!title || !description || !location || !type || !salary) {
      return NextResponse.json({ message: 'Title and Description are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const newJob = {
      title,
      location,
      type,
      salary,
      description,
      createdAt: new Date(),
      status: 'open'  
    };

    const result = await db.collection('jobs').insertOne(newJob);

    return NextResponse.json({ message: 'Job created', jobId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid or missing ID' }, { status: 400 });
    }

    const body = await req.json();
    const { title, description , location , type , salary} = body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          location,
          type,
          salary,
          description,
          
        },
      }
    );

    return NextResponse.json({ message: 'Job updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/applications error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

