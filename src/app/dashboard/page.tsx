
import Image from "next/image"
import {LayoutDashboard , StickyNote , User , FilePlus2} from 'lucide-react';
import { Card } from "@/components/ui/card";
import DeleteJobButton from "@/components/DeleteJobButton"
import LogoutButton from "@/components/LogoutButton";
import clientPromise from '@/lib/mongodb'
import Link from "next/link";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";


export default async function dashboard(){


    const session = await auth();

    if(!session){
        redirect('/login')
    }

    if(session.user?.role !== 'Admin'){
        redirect('/dashboard/jobs')
    }


    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'jobboard');
    const jobs = await db
      .collection('jobs')
      .find()
      .sort({ createdAt: -1 }) 
      .map((job) => ({
        _id: job._id.toString(),
        title: job.title,
        description: job.description,
        location : job.location,
        type:job.type, 
        createdAt: job.createdAt, 
        postedDate: job.createdAt
          ? new Date(job.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'N/A', 
        status: job.status || 'open',
      }))
      .toArray();

    const applicants = await db
    .collection("Applicants")
    .find()
    .sort({ createdAt: -1 }) 
    .toArray();

 
  const applicantsWithJob = await Promise.all(
    applicants.map(async (applicant) => {
      const job = await db.collection("jobs").findOne({ _id: applicant.jobId }); 
      return {
        _id: applicant._id.toString(), 
        name: applicant.firstname,
        email: applicant.email,
        status :applicant.status,
        coverLetter: applicant.info,
        submittedAt: applicant.submittedAt
          ? new Date(applicant.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
          
        jobTitle: job?.title || "Unknown Job", 
      };
    })
  );
    
    const jobsLength = jobs.length;
    const applyLength = applicantsWithJob.length;

    const pending = applicants.filter((deatails) => {
       
        return (deatails.status === 'Pending')
    })

    const short = applicants.filter((deatails) => {
       
        return (deatails.status === 'Shortlisted')
    })

    const pendingcount = pending.length
    const shortcount = short.length

    return(
        <>
           
            <nav className="flex justify-between items-center px-32 py-4 mx-12 my-6 shadow-xl rounded-full">
                <div>
                    <h1 className="text-3xl">HireTrack</h1>
                </div>
                <div className="flex gap-10 items-center">
                    <div className="flex gap-4 items-center">
                    
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image
                        src={"/avatar.jpg"}
                        alt="avatar"
                        height={50}
                        width={50}
                        className="object-cover"
                    />
                    </div>
                    <div>
                        <h1 className="text-[18px]">{session?.user?.name || 'Guest'}</h1>
                        <h5 className="text-[10px]">HR Associste</h5>
                    </div>
                    </div>
                    <LogoutButton/>
                </div>
            </nav>



            <section className="h-[750px] w-80 px-8 py-14 mx-12 my-6 shadow-2xl rounded-4xl absolute">
                <div className="flex flex-col items-start justify-center gap-8">
                    <Link href={"/dashboard/"}><h1 className="flex gap-3 items-center"><LayoutDashboard/>Dashboard</h1></Link>
                    <Link href={"/dashboard/jobs/"}><h1 className="flex gap-3 items-center"><StickyNote/>Job Postings</h1></Link>
                    <Link href={"/dashboard/applicants/"}><h1 className="flex gap-3 items-center"><User/>Applicants</h1></Link>
                    <Link href={"/dashboard/jobs/new"}><h1 className="flex gap-3 items-center"><FilePlus2/>Post a Job</h1></Link>
                </div>
            </section>


            <div className="flex justify-between items-start ml-96 mr-18  mt-[54px] gap-6 ">
                <Card className="w-full px-4 py-8"><h1 className="text-[20px]">📌 Total Job Posts</h1> <h1 className="text-[24px]">{jobsLength}</h1></Card>
                <Card className="w-full px-4 py-8"><h1 className="text-[20px]">👥 Total Applicants</h1> <h1 className="text-[24px]">{applyLength}</h1></Card>
                <Card className="w-full px-4 py-8"><h1 className="text-[20px]">✅ Shortlisted</h1> <h1 className="text-[24px]">{shortcount}</h1></Card>
                <Card className="w-full px-4 py-8"><h1 className="text-[20px]">🕒 Pending Applications</h1> <h1 className="text-[24px]">{pendingcount}</h1></Card>
            </div>


            <section className="flex flex-col justify-between items-start ml-97  mr-18  mt-[24px] gap-4">
                <h1 className="text-2xl">Recent Applicants</h1>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="border-b-2 p-2 text-left">Name</th>
                            <th className="border-b-2 p-2 text-left">Job Applied</th>
                            <th className="border-b-2 p-2 text-left">Date</th>
                            <th className="border-b-2 p-2 text-left">Status</th>
                            <th className="border-b-2 p-2 text-left">View Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            {
                                applicantsWithJob.map((apply) => (
                                  <tr className="hover:bg-gray-50" key={apply._id}>  
                                    <td className="p-2">{apply.name}</td>
                                    <td className="p-2">{apply.jobTitle}</td>
                                    <td className="p-2">{apply.submittedAt}</td>
                                    <td className={`p-2 font-medium text-[18px] ${ apply.status === "Pending"    
                                                                                    ? "text-amber-400"
                                                                                 : apply.status === "Approved"
                                                                                 ? "text-green-500"
                                                                                : "text-gray-500"
                                                                                    }`}
                                            >
                                {apply.status}
                                </td>
                                <td>
                                <Link href={`/dashboard/applicants/${apply._id}`}><td className="p-2">View</td></Link>
                                </td>
                                    
                                </tr>
                                ))
                            }
                           
                        

                        
                    </tbody>
                    
                </table>
            </section>


            <section className="flex flex-col justify-between items-start ml-97  mr-18  mt-[24px] gap-4">
                <h1 className="text-2xl">Latest Job Postings</h1>
                <div className="flex flex-wrap gap-8 mb-7  ">
                    {jobs.map((job) => (
                            <div key={job._id} className="flex flex-col items-start border-1 px-7 py-8 gap-6 w-[400px] rounded-2xl ">
                                <div>
                                    <div className="text-2xl">{job.title}</div>
                                    
                                </div>
                                <div>
                                    <div>Type : {job.type}</div>
                                    <div> Location : {job.location}</div>
                                    <div>Posted : {job.postedDate}</div>
                                </div>
                                <div className="flex gap-4">
                                    
                                    <Link href={`/dashboard/jobs/${job._id}/edit`}><button className="px-6 py-2 border-1 rounded-md cursor-pointer">Edit</button></Link>
                                    <DeleteJobButton jobId={job._id} />
                                </div>
                               
                                </div>
                                
                                
                           

                            
                    ))}
                </div>
            </section>

        </>
    )
}