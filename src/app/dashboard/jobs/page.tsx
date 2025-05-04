
import clientPromise from '@/lib/mongodb';
import Link from 'next/link';
import { auth } from '@/app/lib/auth';
import LogoutButton from '@/components/LogoutButton';
import { redirect } from "next/navigation";
import { ArrowLeft } from 'lucide-react';

export default async function JobsPage() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'jobboard');
  const session = await auth();

  if(!session){
    redirect('/login')
  }

  
  const jobs = await db
    .collection('jobs')
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const applicants = await db
    .collection('Applicants')
    .find()
    .sort({ submittedAt: -1 }) 
    .toArray();

  
  const applicationCounts = applicants.reduce((acc, applicant) => {
    const jobIdStr = applicant.jobId?.toString();
    if (jobIdStr) {
      acc[jobIdStr] = (acc[jobIdStr] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

 
  const jobsWithApplications = jobs.map((job) => ({
    _id: job._id.toString(),
    title: job.title,
    location:job.location,
    type:job.type,
    salary:job.salary,
    postedDate: job.createdAt
      ? new Date(job.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'N/A',
    applications: applicationCounts[job._id.toString()] || 0,
    status: job.status || 'open',
  }));

  return (
    <div className="p-6">
      <div className='flex justify-between  items-center'>
      <h1 className="text-2xl font-bold ">All Jobs</h1>
      {
        session?.user?.role === 'Admin' && <Link href={'/dashboard'}><button className='flex items-center gap-2 border-1 px-3 py-2 rounded-full text-[12px] cursor-pointer hover:shadow-md hover:bg-gray-100 hover:border-gray-400 transition-all duration-300'><ArrowLeft/>Back to Dashboard</button></Link>
      }
      {
        session?.user?.role === 'Applicants' && <LogoutButton />
      }
      </div>
      <div className='text-2xl py-6 flex justify-start gap-6 items-center'>
      {
      session?.user?.role === 'Applicants' && <p>Welcome , {session?.user?.name}</p>
      }
    
      </div>
     
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {jobsWithApplications.map((job) => (
          <div key={job._id} className="p-4 border rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <span className="text-sm text-gray-500">{job.postedDate}</span>
            </div>
            
            <div className="text-md text-gray-600 mt-2">
              <div>Location : <b>{job.location}</b></div>
              <div>Type : <b>{job.type}</b></div>
              <div>Salary : <b>{job.salary}</b></div>
              <div>No. of people applied  : <b>{job.applications}</b></div>
              <div >Status: <b className='text-green-800'>{job.status}</b></div>
            </div>
            
            <Link href={`/dashboard/jobs/${job._id}`}>
              <button className="bg-blue-700 px-3 py-2 rounded-full text-[12px] text-white mt-5 cursor-pointer">
                See Details
              </button>
            </Link>
          </div>
        ))}
     
      </div>
    
      
    </div>
  );
}
