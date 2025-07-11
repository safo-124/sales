import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Use Promise.all to fetch all data concurrently
    const [saleStats, productCount, recentSales] = await Promise.all([
      prisma.sale.aggregate({
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.product.count(),
      prisma.sale.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          saleItems: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalRevenue: saleStats._sum.total || 0,
      totalSales: saleStats._count.id || 0,
      productCount: productCount || 0,
      recentSales: recentSales, // This is now correctly assigned
    });
    
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}