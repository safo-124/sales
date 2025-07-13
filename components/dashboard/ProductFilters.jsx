'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProductFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const selectedCategory = searchParams.get('category') || '';
  const initialSearchQuery = searchParams.get('q') || '';
  
  const [text, setText] = useState(initialSearchQuery);
  const [query] = useDebounce(text, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [query, pathname, router, searchParams]);
  
  const handleTabClick = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <Input
        placeholder="Search products by name..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex space-x-2">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            onClick={() => handleTabClick(null)}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => handleTabClick(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}