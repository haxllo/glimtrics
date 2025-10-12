import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateDatasetInsights } from "@/lib/openai";
import { analyzeData } from "@/lib/analytics";
import { DashboardData } from "@/types/dashboard";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Delete existing insights
    await prisma.insight.deleteMany({
      where: {
        dashboardId: id,
      },
    });

    // Analyze the data
    const data = dashboard.data as unknown as DashboardData;
    const analytics = analyzeData(data);

    // Generate AI insights
    console.log("[AI Insights] Generating insights for:", dashboard.name);
    const aiInsights = await generateDatasetInsights(
      dashboard.name,
      analytics.summary,
      analytics.statistics,
      data.rows
    );

    console.log("[AI Insights] Generated", aiInsights.length, "insights");

    // Save insights to database
    const savedInsights = await Promise.all(
      aiInsights.map((insight) =>
        prisma.insight.create({
          data: {
            dashboardId: id,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            data: (insight.data || {}) as Prisma.InputJsonValue,
          },
        })
      )
    );

    return NextResponse.json({ insights: savedInsights }, { status: 200 });
  } catch (error) {
    console.error("[AI Insights] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate insights" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
    }

    // Fetch insights
    const insights = await prisma.insight.findMany({
      where: {
        dashboardId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("[AI Insights] Error fetching:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
