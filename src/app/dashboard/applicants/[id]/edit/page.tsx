import EditApplicantForm from "@/components/EditApplicantForm";

export default async function EditApplicantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ⬅️ Important in Next.js 15

  return <EditApplicantForm id={id} />;
}