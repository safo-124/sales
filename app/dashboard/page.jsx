// src/app/dashboard/page.jsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductActions } from '@/components/dashboard/ProductActions'; // Import the new component

// This server-side function fetches data from our API endpoint.
async function getProducts() {
  // NOTE: In a real production app, this URL should be an environment variable.
  const res = await fetch('http://localhost:3000/api/products', { 
    cache: 'no-store' // This ensures we always get the latest data.
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Dashboard</h1>
        <Link href="/dashboard/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>
      
      {products.length === 0 ? (
        <p>No products found. Add some to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>In Stock: {product.stock}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold mb-4">GHS {product.price.toFixed(2)}</p>
                {/* Add the ProductActions component here */}
                <ProductActions productId={product.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}