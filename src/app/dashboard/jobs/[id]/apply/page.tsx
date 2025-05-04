'use client';

import { useState, useEffect } from 'react';

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const [jobId, setJobId] = useState<string>('');
  const [firstname, setFirstname] = useState('');
  const [lastname , setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [info, setInfo] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Use useEffect to handle promise resolution
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setJobId(resolvedParams.id); // Set the jobId after resolving the promise
    };

    fetchParams();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, phone, email, country, city, address, info, jobId }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus('✅ Application submitted!');
      setFirstname('');
      setLastname('');
      setEmail('');
      setPhone('');
      setCountry('');
      setCity('');
      setAddress('');
      setInfo('');
    } else {
      setStatus(`❌ Error: ${data?.message || 'Something went wrong!'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Apply for this Job</h2>

      <input
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        placeholder="First Name"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <input
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        placeholder="Last Name"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <input
        type='tel'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone No"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-2 border mb-2 rounded" disabled={loading}>
        <option value="" disabled hidden>Country</option>
        <option value="India">India</option>
        <option value="England">England</option>
        <option value="Bangladesh">Bangladesh</option>
        <option value="USA">USA</option>
        <option value="Canada">Canada</option>
      </select>

      <input
        type='text'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <input
        type='text'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <textarea
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        placeholder="Additional Information"
        required
        className="w-full p-2 border mb-2 rounded"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
}
