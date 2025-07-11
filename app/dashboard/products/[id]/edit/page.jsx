// src/app/dashboard/products/[id]/edit/page.jsx
import { EditProductForm } from '@/components/dashboard/EditProductForm';

async function getProductById(id) {
  // NOTE: In a real production app, this URL should be an environment variable.
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product data');
  }

  return res.json();
}

export default async function EditProductPage({ params }) {
  const product = await getProductById(params.id);

  return <EditProductForm product={product} />;
}