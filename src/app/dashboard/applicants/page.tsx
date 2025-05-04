import clientPromise from '@/lib/mongodb';
import Link from 'next/link';
import DeleteApplicantButton from '@/components/DeleteApplicant';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface ApplicantQuery {
  $or: Array<{ firstname: { $regex: string; $options: string }; lastname?: never } | { lastname: { $regex: string; $options: string }; firstname?: never }>;
  status?: { $regex: string; $options: string };
}

interface SearchParams {
  q?: string;
  status?: string;
}

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, status } = await searchParams;

  const session = await auth();
  if (!session) redirect('/login');

  const query = q?.toLowerCase() || '';
  const statusFilter = status?.toLowerCase();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'jobboard');

  const mongoQuery: ApplicantQuery = {
    $or: [
      { firstname: { $regex: query, $options: 'i' } },
      { lastname: { $regex: query, $options: 'i' } },
    ],
  };
  
  if (statusFilter) {
    mongoQuery.status = { $regex: `^${statusFilter}$`, $options: 'i' };
  }

  const applicants = await db
    .collection('Applicants')
    .find(mongoQuery)
    .sort({ submittedAt: -1 })
    .toArray();

  const AllApplications = await Promise.all(
    applicants.map(async (applicant) => {
      const job = await db.collection('jobs').findOne({ _id: applicant.jobId });
      return {
        _id: applicant._id.toString(),
        name: `${applicant.firstname} ${applicant.lastname}`,
        email: applicant.email,
        phone: applicant.phone,
        submittedAt: applicant.submittedAt
          ? new Date(applicant.submittedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'N/A',
        status: applicant.status || 'Pending',
        jobTitle: job?.title || 'Unknown Job',
      };
    })
  );

  // Ensure JSX is wrapped in parentheses
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">All Applicants</h1>
        <Link href={'/dashboard'}>
          <button className="flex items-center gap-2 border-1 px-3 py-2 rounded-full text-[12px] cursor-pointer hover:shadow-md hover:bg-gray-100 hover:border-gray-400 transition-all duration-300">
            <ArrowLeft /> Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Search form */}
      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q || ''}
          placeholder="Search By Name"
          className="border px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Search
        </button>
        <div className="flex gap-2 mt-2"></div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {AllApplications.map((job) => (
          <div key={job._id} className="p-4 border rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{job.name}</h2>
              <span className="text-sm text-gray-500">{job.submittedAt}</span>
            </div>
            <div className="text-md text-gray-600 mt-2 flex flex-col gap-1">
              <div>Phone No: <b>{job.phone}</b></div>
              <div>Email : <b>{job.email}</b></div>
              <div>Job Applied For : <b>{job.jobTitle}</b> </div>
              <div
                className={`font-semibold text-sm mt-1 
                  ${job.status === 'Approved' ? 'text-green-600' : 
                    job.status === 'Pending' ? 'text-amber-500' : 
                    job.status === 'Rejected' ? 'text-red-500' : 
                    'text-gray-600'}`}
              >
                Status: {job.status}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/applicants/${job._id}`}>
                <button className="bg-blue-700 px-3 py-2 rounded-full text-[12px] text-white mt-5 cursor-pointer">
                  See Details
                </button>
              </Link>
              <DeleteApplicantButton applicantId={job._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
