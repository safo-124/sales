'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserActions({ userId, currentUserId }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
        router.refresh();
    } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user.');
    }
  };

  // The current user cannot delete their own account
  const isCurrentUser = userId === currentUserId;

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/dashboard/users/${userId}/edit`}>
        <Button variant="outline" size="sm">Edit</Button>
      </Link>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDelete} 
        disabled={isCurrentUser}
      >
        Delete
      </Button>
    </div>
  );
}