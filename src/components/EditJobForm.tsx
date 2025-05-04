'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type EditJobFormProps = {
  id: string
}

export default function EditJobForm({ id }: EditJobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    salary: '',
    description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/jobs/${id}`)
      if (!res.ok) {
        alert('Failed to load job')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/jobs?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          placeholder="Job Title"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          placeholder="Location"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="" disabled hidden>Type</option>
          <option value="Remote">Remote</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="WFH">WFH</option>
        </select>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          placeholder="Salary"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
          placeholder="Description"
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
