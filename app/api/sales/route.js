import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const whereClause = {};

  if (userId) {
    whereClause.userId = userId;
  }

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  try {
    const sales = await prisma.sale.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
        user: { select: { name: true } },
        customer: { select: { name: true } } // <-- Add this line
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Failed to fetch sales:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { total, saleItems, customerId } = await request.json(); // <-- Get customerId from request

    if (!total || !saleItems || saleItems.length === 0) {
      return NextResponse.json({ message: "Missing required sale data" }, { status: 400 });
    }

    const newSale = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          total: parseFloat(total),
          userId: userId,
          customerId: customerId, // <-- Add customerId here
        },
      });

      const stockUpdates = saleItems.map(item => {
        return tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: parseInt(item.quantity, 10) } },
        });
      });

      const saleItemsWithSaleId = saleItems.map(item => ({
        ...item,
        saleId: sale.id,
      }));

      await tx.saleItem.createMany({ data: saleItemsWithSaleId });
      await Promise.all(stockUpdates);
      return sale;
    });

    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error("Failed to create sale:", error);
    if (error.code === 'P2025' || error.message.includes('decrement')) {
      return NextResponse.json({ message: "Insufficient stock for one or more items." }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}