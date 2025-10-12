import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid dataset IDs" },
        { status: 400 }
      );
    }

    // Verify ownership of all datasets
    const dashboards = await prisma.dashboard.findMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    });

    if (dashboards.length !== ids.length) {
      return NextResponse.json(
        { error: "Some datasets not found or unauthorized" },
        { status: 403 }
      );
    }

    // Delete associated insights first
    await prisma.insight.deleteMany({
      where: { dashboardId: { in: ids } },
    });

    // Delete the dashboards
    const result = await prisma.dashboard.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `${result.count} dataset(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete datasets" },
      { status: 500 }
    );
  }
}
