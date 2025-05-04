'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import React from 'react'

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type :'',
    salary : '',
    description: '',
    
  })

  // Use React.use() to unwrap the promise and get the actual `params`
  const id = React.use(params)?.id;

  useEffect(() => {
    if (!id) return; // Ensure the ID is valid before fetching data

    const fetchData = async () => {
      const res = await fetch(`/api/jobs/${id}`)
      if (!res.ok) {
        alert('Failed to load applicant')
        router.push('/dashboard/jobs')
        return
      }
      const data = await res.json()
      setFormData({
        title: data.title,
        location: data.location,
        type: data.type,
        salary: data.salary,
        description: data.description,
        
      })
      setLoading(false)
    }

    fetchData()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/jobs?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Updated successfully!')
        router.push('/dashboard/jobs')
      } else {
        alert(data.message || 'Failed to update')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred')
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Job Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="name"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

      <select name="type" className="w-full border px-4 py-2 rounded" value={formData.type} onChange={handleChange} required >
        <option value="" disabled hidden>Type</option>
        <option value="Remote">Remote</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="WFH">WFH</option>
      </select>

        <input
          type="number"
          name="name"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
