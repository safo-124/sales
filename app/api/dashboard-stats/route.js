// src/app/api/dashboard-stats/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Use Promise.all to fetch all stats concurrently
    const [totalRevenue, totalSales, productCount] = await Promise.all([
      prisma.sale.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.sale.count(),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalSales: totalSales || 0,
      productCount: productCount || 0,
    });
    
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}