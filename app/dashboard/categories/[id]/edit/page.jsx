import prisma from '@/lib/db';
import { EditCategoryForm } from '@/components/dashboard/EditCategoryForm';

export default async function EditCategoryPage({ params }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    return <p>Category not found.</p>;
  }

  return <EditCategoryForm category={category} />;
}