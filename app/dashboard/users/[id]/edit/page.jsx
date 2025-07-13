import prisma from '@/lib/db';
import { EditUserForm } from '@/components/dashboard/EditUserForm';

export default async function EditUserPage({ params }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return <p>User not found.</p>;
  }

  return <EditUserForm user={user} />;
}