import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { MapPin , Clock12 , CircleDollarSign } from 'lucide-react';

interface JobDetailProps {
  params: { id: string };
}

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export default async function JobDetails({ params }: JobDetailProps) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return <div className="text-red-600 text-center mt-10">Invalid Job ID</div>;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || 'jobboard');

  const job = await db.collection('jobs').findOne({ _id: new ObjectId(id) });

  if (!job) {
    return <div className="text-center mt-10">Job not found</div>;
  }

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

    

  return (
    
    <div className="p-6 border rounded shadow max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <div className='flex gap-14'>
        <div className='flex flex-col'>
          <div className='flex gap-2 text-md items-center'> <MapPin/> Location</div>
          <div className='font-medium text-[24px]'>{job.location}</div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-2 text-md items-center'> <Clock12/> Type</div>
          <div className='font-medium text-2xl'>{job.type}</div>
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-2 text-md items-center'> <CircleDollarSign/> Salary</div>
          <div className='font-medium text-2xl'>${job.salary}</div>
        </div>
      </div>
      <div className='pt-8'>
        <div className='py-4'>
        <p><strong>Description</strong></p>
        {job.description}
        </div>
      
      <p><strong>Status:</strong> {job.status || 'open'}</p>
      <p><strong>Posted:</strong> {postedDate}</p>
      </div>
      
      <Link href={`/dashboard/jobs/${job._id}/apply`}><button className='bg-blue-700 px-5 py-2 rounded-full text-[12px] text-white mt-5 cursor-pointer'>Apply</button></Link>
    </div>
   
   
  );
}
