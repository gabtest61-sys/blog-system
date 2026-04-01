import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Step 1: Ask OpenAI to generate blog content
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert blog writer. Generate a blog post in JSON format with these exact fields:
- "title": A compelling, SEO-friendly title
- "excerpt": A 1-2 sentence summary (max 160 characters)
- "content": The full blog post in plain text with clear sections

Write in a professional but approachable tone. Make the content informative and engaging.`,
        },
        {
          role: "user",
          content: `Write a blog post about: ${body.topic}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const generated = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    if (!generated.title || !generated.content) {
      return NextResponse.json(
        { error: "AI failed to generate valid content" },
        { status: 500 }
      );
    }

    // Step 2: Create a slug from the title
    const slug = generated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Step 3: Save to database
    const post = await prisma.post.create({
      data: {
        title: generated.title,
        slug,
        excerpt: generated.excerpt || null,
        content: generated.content,
        published: body.published ?? true,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 409 }
      );
    }

    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate post" },
      { status: 500 }
    );
  }
}
