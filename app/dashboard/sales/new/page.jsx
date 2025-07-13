import { NewSaleForm } from '@/components/dashboard/NewSaleForm';
import prisma from '@/lib/db';

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });
  return products;
}

async function getCustomers() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  });
  return customers;
}

export default async function NewSalePage() {
  const [products, customers] = await Promise.all([
    getProducts(),
    getCustomers(),
  ]);
  
  return <NewSaleForm products={products} customers={customers} />;
}