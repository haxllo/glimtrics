import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateChatResponse } from "@/lib/openai";
import { analyzeData } from "@/lib/analytics";
import { DashboardData } from "@/types/dashboard";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await req.json();
    const { message } = body;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch the dashboard
    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
    }

    // Analyze the data for context
    const data = dashboard.data as unknown as DashboardData;
    const analytics = analyzeData(data);

    // Generate response using OpenAI
    console.log("[AI Chat] Generating response for:", dashboard.name);
    const response = await generateChatResponse(message, {
      name: dashboard.name,
      summary: analytics.summary as Record<string, unknown>,
      statistics: analytics.statistics as Record<string, unknown>,
    });

    console.log("[AI Chat] Response generated");

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate response" },
      { status: 500 }
    );
  }
}
