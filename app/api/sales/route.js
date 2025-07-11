// src/app/api/sales/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
      const sales = await prisma.sale.findMany({
        orderBy: {
          createdAt: 'desc', // Show the most recent sales first
        },
        include: {
          saleItems: {
            include: {
              product: true, // Include product details for each sale item
            },
          },
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
    const { total, saleItems } = await request.json();

    // Basic validation
    if (!total || !saleItems || saleItems.length === 0) {
      return NextResponse.json({ message: "Missing required sale data" }, { status: 400 });
    }

    // Use a transaction to ensure all operations succeed or fail together
    const newSale = await prisma.$transaction(async (tx) => {
      // 1. Create the main Sale record
      const sale = await tx.sale.create({
        data: {
          total: parseFloat(total),
        },
      });

      // 2. Create SaleItem records and prepare stock updates
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

      // Add SaleId to each item for creation
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
    // Check for specific error, e.g., insufficient stock
    if (error.code === 'P2025' || error.message.includes('decrement')) {
       return NextResponse.json({ message: "Insufficient stock for one or more items." }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}