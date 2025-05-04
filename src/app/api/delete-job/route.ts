import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ message: 'Missing job ID' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'jobboard')

    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 })
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting job', error: err }, { status: 500 });
  }
}
