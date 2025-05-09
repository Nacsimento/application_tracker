import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import Link from 'next/link';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export default async function ApplicantDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ await because `params` is a Promise in Next.js 15

  if (!isValidObjectId(id)) {
    return (
      <div className="text-red-600 text-center mt-10">
        Invalid Applicant ID
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'jobboard');

  const job = await db
    .collection('Applicants')
    .findOne({ _id: new ObjectId(id) });

  if (!job) {
    return <div className="text-center mt-10">Applicant not found</div>;
  }

  const postedDate = job.submittedAt
    ? new Date(job.submittedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="p-6 border rounded shadow max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Applicant Details</h1>
      <p><strong>Name:</strong> {job.firstname} {job.lastname}</p>
      <p><strong>Email:</strong> {job.email}</p>
      <p><strong>Phone No:</strong> {job.phone}</p>
      <p><strong>Country:</strong> {job.country}</p>
      <p><strong>Info:</strong> {job.info || 'Not Provided'}</p>
      <p><strong>Submitted:</strong> {postedDate}</p>

      <Link href={`/dashboard/applicants/${job._id}/edit`}>
        <button className="bg-blue-700 px-5 py-2 rounded-full text-[12px] text-white mt-5 cursor-pointer">
          Edit
        </button>
      </Link>
    </div>
  );
}
