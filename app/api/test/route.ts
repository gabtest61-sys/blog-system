import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.post.count()
    return NextResponse.json({
      success: true,
      message: 'Database connected!',
      postCount: count
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database connection failed'
    }, { status: 500 })
  }
}
