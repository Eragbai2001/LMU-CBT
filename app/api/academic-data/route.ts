import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [departments, levels] = await Promise.all([
      prisma.department.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.level.findMany({
        orderBy: { value: 'asc' }
      })
    ]);
    
    return NextResponse.json({ departments, levels });
  } catch (error) {
    console.error('Failed to fetch academic data:', error);
    return NextResponse.json(
      { error: 'Failed to load academic data' },
      { status: 500 }
    );
  }
}