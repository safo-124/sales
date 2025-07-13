// src/app/dashboard/products/[id]/edit/page.jsx
import prisma from '@/lib/db';
import { EditProductForm } from '@/components/dashboard/EditProductForm';

export default async function EditProductPage({ params }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany(),
  ]);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return <EditProductForm product={product} categories={categories} />;
}