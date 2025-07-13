import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // This path is now corrected
import prisma from '@/lib/db';

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

// CREATE a new category
export async function POST(request) {
  const session = await getServerSession(authOptions);

  // Protect route for owners only
  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return new NextResponse(JSON.stringify({ message: 'Category name is required.' }), { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });

  } catch (error) {
    if (error.code === 'P2002') {
      return new NextResponse(JSON.stringify({ message: 'A category with this name already exists.' }), { status: 400 });
    }
    console.error("Failed to create category:", error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}