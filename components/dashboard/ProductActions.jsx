'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ProductActions({ productId, userRole }) {
  const router = useRouter();

  // If the user is not an owner, render nothing.
  if (userRole !== 'OWNER') {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });

    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Link href={`/dashboard/products/${productId}/edit`} className="flex-1">
        <Button variant="outline" className="w-full">Edit</Button>
      </Link>
      <Button variant="destructive" onClick={handleDelete} className="flex-1">
        Delete
      </Button>
    </div>
  );
}