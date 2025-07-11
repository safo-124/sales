// src/app/dashboard/sales/new/page.jsx
import { NewSaleForm } from '@/components/dashboard/NewSaleForm';

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function NewSalePage() {
  const products = await getProducts();
  return <NewSaleForm products={products} />;
}