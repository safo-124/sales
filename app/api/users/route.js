import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

// Add this new GET function
export async function GET() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an OWNER
  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      // Exclude password field for security
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

// This POST function already exists
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
  }

  try {
    const data = await request.json();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    if (error.code === 'P2002') {
      return new NextResponse(JSON.stringify({ message: 'Email already in use.' }), { status: 400 });
    }
    console.error("Failed to create user:", error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}