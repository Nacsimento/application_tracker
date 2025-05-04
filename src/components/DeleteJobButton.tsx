'use client'

import React from 'react'

interface DeleteJobButtonProps {
  jobId: string
}

const DeleteJobButton: React.FC<DeleteJobButtonProps> = ({ jobId }) => {
  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this job?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/delete-job?id=${jobId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      alert(data.message)

      if (res.ok) {
        // Refresh the page to show updated job list
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('An error occurred while deleting the job.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-700 text-white rounded-md cursor-pointer"
    >
      Delete
    </button>
  )
}

export default DeleteJobButton
