// src/components/layout/Sidebar.jsx
import Link from 'next/link';
import { NavLink } from './NavLink';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignOutButton } from './SignOutButton';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';

// Use simple strings for icons now
const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: 'home' },
  { href: '/dashboard/sales/new', label: 'New Sale', icon: 'cart' },
  { href: '/dashboard/sales', label: 'Sales History', icon: 'chart' },
];

export async function Sidebar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>Sales App</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                label={link.label} 
                iconName={link.icon} // Pass the string name
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>{session?.user?.name}</CardTitle>
              <CardDescription>{session?.user?.role}</CardDescription>
            </CardHeader>
          </Card>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}