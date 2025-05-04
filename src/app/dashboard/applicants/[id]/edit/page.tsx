import EditApplicantForm from "@/components/EditApplicantForm"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditApplicantPage({ params }: PageProps) {
  return <EditApplicantForm id={params.id} />
}