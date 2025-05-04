'use client'

import React from 'react'

interface DeleteApplicantButtonProps {
  applicantId: string
}

const DeleteApplicantButton: React.FC<DeleteApplicantButtonProps> = ({ applicantId }) => {
  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this applicant?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/applications?id=${applicantId}`, {
        method: 'DELETE',
      })

   

      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (data?.message) {
          alert(data.message)
        } else {
          alert('Applicant deleted successfully.')
        }
        window.location.reload()
} else {
  const error = await res.text()
  alert(`Failed to delete applicant: ${error}`)
}

    } catch (error) {
      console.error('Error deleting Applicant:', error)
      alert('An error occurred while deleting the Applicant.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 px-6 py-2 rounded-full text-[12px] text-white mt-5 cursor-pointer"
    >
      Delete
    </button>
  )
}

export default DeleteApplicantButton
