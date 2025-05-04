'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditApplicantForm({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstname: '', lastname: '', phone: '', email: '', country: '', city: '', address: '', info: '', status: 'Pending',
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/applications/${id}`)
      if (!res.ok) {
        alert('Failed to load applicant')
        router.push('/dashboard/applicants')
        return
      }
      const data = await res.json()
      setFormData({
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        email: data.email,
        country: data.country,
        city: data.city,
        address: data.address,
        info: data.info,
        status: data.status || 'Pending'
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
      const res = await fetch(`/api/applications?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Updated successfully!')
        router.push('/dashboard/applicants')
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
      <h1 className="text-xl font-bold mb-4">Edit Applicant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="First Name" />
        <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="Last Name" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="Email" />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="Phone" />
        <select name="country" value={formData.country} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="England">England</option>
          <option value="Bangladesh">Bangladesh</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
        </select>
        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="City" />
        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="Address" />
        <textarea name="info" value={formData.info} onChange={handleChange} className="w-full border px-4 py-2 rounded" required placeholder="Additional Information"></textarea>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Approved">Approved</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  )
}
