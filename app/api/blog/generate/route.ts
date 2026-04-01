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
      model: "gpt-3.5-turbo",
      max_tokens: 800,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are an SEO blog writer. Return JSON with these string fields:
- "title": SEO-friendly title (under 60 chars)
- "excerpt": one sentence summary (under 150 chars)
- "content": a single string with this structure:
  1. Opening paragraph that directly answers the topic (for featured snippets)
  2. 2-3 sections, each starting with a line like "## Section Title"
  3. End with "## FAQ" section with 2-3 Q&A pairs formatted as "Q: ... A: ..."
Keep it concise. All fields must be strings, not arrays.`,
        },
        {
          role: "user",
          content: `Blog post about: ${body.topic}`,
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

    // Ensure content is a single string (AI sometimes returns an array)
    const content = Array.isArray(generated.content)
      ? generated.content.join("\n\n")
      : generated.content;

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
        content,
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
