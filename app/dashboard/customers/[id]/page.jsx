import prisma from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getCustomerDetails(id) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          orderBy: { createdAt: 'desc' },
          include: {
            saleItems: {
              include: { product: true }
            }
          }
        }
      }
    });
    return customer;
}

export default async function CustomerDetailPage({ params }) {
    const customer = await getCustomerDetails(params.id);

    if (!customer) {
        return <p className="p-8">Customer not found.</p>
    }

    return (
        <div className="p-8">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-3xl">{customer.name}</CardTitle>
                    <CardDescription>
                        {customer.phone || 'No phone number on record'}
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Receipt</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.sales.map(sale => (
                                <TableRow key={sale.id}>
                                    <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{sale.saleItems.map(item => item.product.name).join(', ')}</TableCell>
                                    <TableCell className="text-right">GHS {sale.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/sales/${sale.id}/receipt`}>
                                          <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}