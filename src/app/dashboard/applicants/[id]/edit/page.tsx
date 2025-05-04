import EditApplicantForm from "@/components/EditApplicantForm"

export default function EditApplicantPage({ params }: { params: { id: string } }) {
  return <EditApplicantForm id={params.id} />
}