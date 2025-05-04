'use client';

import { useState } from 'react';

export default function NewUser() {
  const [name, setName] = useState('');
  const [pass, setpass] = useState('');
  const [status , setStatus] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password : pass , role : selectedValue }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('✅ Registered');
      setName('');
      setpass('');
    } else {
      setStatus(`❌ Error: ${data.message}`);
    }
  };

  return (
    <>
    <div className="text-center mt-10 pb-10">
  <h1 className="text-4xl font-bold text-gray-800">Welcome to HireTrack</h1>
  <p className="mt-2 text-lg text-gray-600">Your smart hiring assistant</p>
</div>
    <div className='flex justify-center items-center '>
    <form onSubmit={handleSubmit} className="p-4 max-w-xl">
      <h2 className="text-xl font-bold mb-4">New User , Register Now</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Usernmae"
        required
        className="w-full p-2 border mb-2 rounded"
      />

      <input
        value={pass}
        type='password'
        onChange={(e) => setpass(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-2 border mb-2 rounded"
      />
      <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} required className='w-full p-2 border mb-2 rounded' >
      <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="Applicants">Applicants</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Register
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
    </div>
    </>
  );
}
