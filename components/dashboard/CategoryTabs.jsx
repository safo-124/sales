'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CategoryTabs({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const handleTabClick = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category'); // For the "All" tab
    }
    router.push(`/dashboard/products?${params.toString()}`);
  };

  return (
    <div className="w-full overflow-x-auto pb-2 mb-6">
      <div className="flex space-x-4">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          onClick={() => handleTabClick(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => handleTabClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}