import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        sales: {
          orderBy: { createdAt: 'desc' },
          include: {
            saleItems: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}