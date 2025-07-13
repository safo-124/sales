import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesHistoryClient } from "@/components/dashboard/SalesHistoryClient";
import prisma from "@/lib/db";

async function getSales() {
  // Fetches initial, unfiltered sales
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      saleItems: { include: { product: true } },
      user: { select: { name: true } }
    }
  });
  return sales;
}

async function getUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  });
  return users;
}

export default async function SalesHistoryPage() {
  const [initialSales, users] = await Promise.all([getSales(), getUsers()]);

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesHistoryClient initialSales={initialSales} users={users} />
        </CardContent>
      </Card>
    </div>
  );
}