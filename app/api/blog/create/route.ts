import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create a URL-friendly slug from the title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric with dashes
      .replace(/^-|-$/g, '')          // remove leading/trailing dashes

    // Save to database
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content,
        published: body.published ?? true,
      },
    })

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error: any) {
    // Handle duplicate slug
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
