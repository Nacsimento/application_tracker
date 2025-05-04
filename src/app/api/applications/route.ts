import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { firstname, lastname , phone,  email, country , city , address , info,  jobId } = await req.json();

    if (!firstname || !email || !info || !lastname || !phone || !country || !city || !address || !jobId) {
      return NextResponse.json({ message: 'All fields including jobId are required' }, { status: 400 });
    }

    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const newApplication = {
      firstname,
      lastname,
      email,
      phone,
      country,
      city,
      address,
      info,
      status : 'Pending',
      jobId: new ObjectId(jobId),
      submittedAt: new Date(),
    };

    const result = await db.collection('Applicants').insertOne(newApplication);

    return NextResponse.json({ message: 'Application received', appId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/applications error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid or missing ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const result = await db.collection('Applicants').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Applicant deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('DELETE /api/applications error:', error);
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
    const { firstname, lastname , phone,  email, country , city , address , info, status } = body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const result = await db.collection('Applicants').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstname, lastname , phone,  email, country , city , address , info, status
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Applicant updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/applications error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


