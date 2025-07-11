// src/app/api/sales-chart/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dailySales = {};

    // Initialize the last 7 days with 0 sales
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailySales[formattedDate] = 0;
    }

    // Populate with actual sales data
    sales.forEach(sale => {
      const date = new Date(sale.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailySales[date] !== undefined) {
        dailySales[date] += sale.total;
      }
    });

    const chartData = Object.keys(dailySales).map(date => ({
      name: date,
      total: dailySales[date],
    })).reverse(); // Reverse to show oldest date first

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Failed to fetch sales chart data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}