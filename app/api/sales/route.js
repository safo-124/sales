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
        user: { // Also include the user who made the sale
          select: {
            name: true,
          }
        }
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


// Replace your existing POST function with this one.
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { total, saleItems } = await request.json();

    if (!total || !saleItems || saleItems.length === 0) {
      return NextResponse.json({ message: "Missing required sale data" }, { status: 400 });
    }

    const newSale = await prisma.$transaction(async (tx) => {
      // 1. Create the main Sale record, now including the userId
      const sale = await tx.sale.create({
        data: {
          total: parseFloat(total),
          userId: userId, // <-- This is the required fix
        },
      });

      // 2. Prepare stock updates
      const stockUpdates = saleItems.map(item => {
        return tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: parseInt(item.quantity, 10),
            },
          },
        });
      });
      
      const saleItemsWithSaleId = saleItems.map(item => ({
        ...item,
        saleId: sale.id,
      }));

      // 3. Create the SaleItem records
      await tx.saleItem.createMany({
        data: saleItemsWithSaleId,
      });

      // 4. Execute all the stock updates
      await Promise.all(stockUpdates);

      return sale;
    });

    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error("Failed to create sale:", error);
    if (error.code === 'P2025' || error.message.includes('decrement')) {
       return NextResponse.json({ message: "Insufficient stock for one or more items." }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}