'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, ShoppingCart, BarChart, Users, Tag, Package, Contact } from 'lucide-react'; // Add Contact

const iconMap = {
  home: Home,
  package: Package,
  cart: ShoppingCart,
  chart: BarChart,
  contact: Contact, // Add the new mapping
  users: Users,
  tag: Tag,
};

export function NavLink({ href, label, iconName }) {
  const pathname = usePathname();
  const Icon = iconMap[iconName];

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        { 'bg-muted text-primary': pathname === href }
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
}