import EditJobForm from "@/components/EditJobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }>}) {
  const {id} = await params
  return <EditJobForm id={id} />
}