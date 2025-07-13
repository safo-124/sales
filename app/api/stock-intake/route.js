import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'OWNER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { intakeItems } = await request.json();

    if (!intakeItems || intakeItems.length === 0) {
      return NextResponse.json({ message: "No items to add." }, { status: 400 });
    }

    // Use a transaction to update all products at once
    const stockUpdates = intakeItems.map(item => {
      return prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: parseInt(item.quantity, 10),
          },
        },
      });
    });

    await prisma.$transaction(stockUpdates);

    return NextResponse.json({ message: 'Stock updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Failed to update stock:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}