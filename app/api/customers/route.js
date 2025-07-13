import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

// CREATE a new customer
export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name) {
      return new NextResponse(JSON.stringify({ message: 'Customer name is required.' }), { status: 400 });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });

  } catch (error) {
    if (error.code === 'P2002') {
      return new NextResponse(JSON.stringify({ message: 'A customer with this phone number already exists.' }), { status: 400 });
    }
    console.error("Failed to create customer:", error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}