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
import { ProductActions } from '@/components/dashboard/ProductActions';
import { DollarSign, Package, ShoppingCart } from 'lucide-react'; // Import icons

// Fetch statistics
async function getStats() {
  const res = await fetch('http://localhost:3000/api/dashboard-stats', {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// Fetch products
async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', { 
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function DashboardPage() {
  // Fetch data in parallel
  const [stats, products] = await Promise.all([getStats(), getProducts()]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
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
                <ProductActions productId={product.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}