'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NewJobForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description , location , type , salary }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('✅ Job posted!');
      setTitle('');
      setLocation('');
      setType('');
      setSalary('');
      setDescription('');
    } else {
      setStatus(`❌ Error: ${data.message}`);
    }
  };

  return (
    <div className='flex justify-center'>
    <form onSubmit={handleSubmit} className="p-4 max-w-xl">
      <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Job Title"
        required
        className="w-full p-2 border mb-2 rounded"
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
        className="w-full p-2 border mb-2 rounded"
      />

      <select name="type" className="w-full p-2 border mb-2 rounded" value={type} onChange={(e) => setType(e.target.value)} required >
        <option value="" disabled hidden>Type</option>
        <option value="Remote">Remote</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="WFH">WFH</option>
      </select>

      <input
        type='text'
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Salary"
        required
        className="w-full p-2 border mb-2 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Job Description"
        required
        className="w-full p-2 border mb-2 rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded  cursor-pointer hover:bg-blue-800  transition-all duration-300">
        Submit
      </button>
      <Link href={'/dashboard'}><button type="submit" className="border border-gray-300 px-4 py-2 rounded  cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 ml-3.5">
        Back to Dashboard
      </button></Link>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
    </div>
  );
}
