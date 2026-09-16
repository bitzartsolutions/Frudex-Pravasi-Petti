import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryEditClient } from "@/components/admin/CategoryEditClient";
import { getCategoryById } from "@/lib/data/adminCatalog";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <>
      <AdminHeader title={`Edit — ${category.name}`} />
      <div className="p-space-lg">
        <CategoryEditClient category={category} />
      </div>
    </>
  );
}
