import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductActions } from '@/components/dashboard/ProductActions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import prisma from '@/lib/db';
import { ProductFilters } from '@/components/dashboard/ProductFilters'; // Import the new component

const LOW_STOCK_THRESHOLD = 5;

// This function now accepts both categoryId and a search query for filtering
async function getProducts({ categoryId, query }) {
  const whereClause = {};

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  
  if (query) {
    whereClause.name = {
      contains: query,
      mode: 'insensitive', // Case-insensitive search
    };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return products;
}

async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
}

// The page now accepts searchParams to read the URL query
export default async function ProductsPage({ searchParams }) {
  const categoryId = searchParams.category;
  const query = searchParams.q;

  const [session, products, categories] = await Promise.all([
    getServerSession(authOptions),
    getProducts({ categoryId, query }),
    getCategories(),
  ]);

  const userRole = session?.user?.role;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        {userRole === 'OWNER' && (
          <Link href="/dashboard/products/new">
            <Button>Add New Product</Button>
          </Link>
        )}
      </div>

      {/* Add the new ProductFilters component here */}
      <ProductFilters categories={categories} />

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
            No products found. Try adjusting your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
            return (
              <Card 
                key={product.id} 
                className={cn("flex flex-col", isLowStock && "border-red-500")}
              >
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle>{product.name}</CardTitle>
                    {isLowStock && <Badge variant="destructive">Low Stock</Badge>}
                  </div>
                  <CardDescription>
                    {product.category ? product.category.name : 'Uncategorized'}
                  </CardDescription>
                  <CardDescription>In Stock: {product.stock}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold mb-4">GHS {product.price.toFixed(2)}</p>
                  <ProductActions productId={product.id} userRole={userRole} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}