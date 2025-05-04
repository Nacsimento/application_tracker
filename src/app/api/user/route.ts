import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { name, password , role } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ message: 'Name and password are required' }, { status: 400 });


    }

   

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');

    const existingUser = await db.collection('users').findOne({ name : name , role : 'Applicants' });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const newUser = {
      name,
      password : hashedPassword ,
      role
    }

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'User registered', userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/user error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
