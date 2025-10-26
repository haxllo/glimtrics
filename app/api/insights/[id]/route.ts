import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  enqueueInsightGeneration,
  getInsightQueueEvents,
} from "@/lib/jobs/insight-queue";

export const runtime = "nodejs";

// Increase timeout for AI generation (Vercel default is 10s)
export const maxDuration = 60; // 60 seconds for Pro plan, 10s for Hobby

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

    const job = await enqueueInsightGeneration({
      dashboardId: id,
      userId: session.user.id,
    });

    try {
      const queueEvents = getInsightQueueEvents();
      await queueEvents.waitUntilReady();
      const result = await job.waitUntilFinished(queueEvents);
      return NextResponse.json({ insights: result.insights }, { status: 200 });
    } catch (jobError) {
      console.error("[AI Insights] Job failed", job.id, jobError);
      const errorMessage =
        jobError instanceof Error ? jobError.message : "Failed to generate insights";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
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
