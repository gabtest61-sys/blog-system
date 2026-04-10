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

export async function POST(request: Request) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.POSTS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      focusKeyword,
      published,
    } = body

    // Basic validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const existing = await prisma.post.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Post with slug "${slug}" already exists` },
        { status: 409 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt:         excerpt         ?? null,
        metaTitle:       metaTitle       ?? null,
        metaDescription: metaDescription ?? null,
        focusKeyword:    focusKeyword    ?? null,
        published:       published       ?? false,
      },
    })

    return NextResponse.json(
      { success: true, post },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/posts]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}