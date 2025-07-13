// src/app/api/sales-chart/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  // Default to last 7 days if no range is provided
  const endDate = endDateParam ? new Date(endDateParam) : new Date();
  const startDate = startDateParam ? new Date(startDateParam) : new Date(new Date().setDate(new Date().getDate() - 7));
  
  try {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dailySales = {};

    // Populate with actual sales data
    sales.forEach(sale => {
      const date = new Date(sale.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += sale.total;
    });

    const chartData = Object.keys(dailySales).map(date => ({
      name: date,
      total: dailySales[date],
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Failed to fetch sales chart data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}