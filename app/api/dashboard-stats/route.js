// src/app/api/dashboard-stats/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const dateFilter = (startDate && endDate)
    ? { createdAt: { gte: new Date(startDate), lte: new Date(endDate) } }
    : {};

  try {
    const [saleStats, productCount, recentSales] = await Promise.all([
      prisma.sale.aggregate({
        where: dateFilter, // Apply date filter here
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.product.count(),
      prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          saleItems: { include: { product: { select: { name: true } } } },
        },
      }),
    ]);

    return NextResponse.json({
      totalRevenue: saleStats._sum.total || 0,
      totalSales: saleStats._count.id || 0,
      productCount: productCount || 0,
      recentSales: recentSales,
    });
    
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}