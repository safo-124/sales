import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // This path is now corrected

// Helper function to escape CSV fields
const escapeCsvField = (field) => {
  if (field === null || field === undefined) {
    return '';
  }
  const str = String(field);
  // If the field contains a comma, double quote, or newline, enclose it in double quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    // Escape existing double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'OWNER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ message: 'Date range is required.' }, { status: 400 });
  }

  try {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        user: { select: { name: true } },
        customer: { select: { name: true } },
        saleItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const headers = [
      'Sale ID', 'Date', 'Time', 'Sales Person', 'Customer',
      'Product Name', 'Quantity', 'Price Per Item (GHS)', 'Subtotal (GHS)'
    ];

    let csvContent = headers.join(',') + '\n';

    sales.forEach(sale => {
      sale.saleItems.forEach(item => {
        const row = [
          sale.id,
          new Date(sale.createdAt).toLocaleDateString(),
          new Date(sale.createdAt).toLocaleTimeString(),
          sale.user.name,
          sale.customer?.name || 'N/A',
          item.product.name,
          item.quantity,
          item.price.toFixed(2),
          (item.quantity * item.price).toFixed(2)
        ].map(escapeCsvField).join(',');
        csvContent += row + '\n';
      });
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sales_report_${startDate}_to_${endDate}.csv"`,
      },
    });

  } catch (error) {
    console.error("Failed to generate report:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}