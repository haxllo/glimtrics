import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete associated insights first (cascade)
    await prisma.insight.deleteMany({
      where: { dashboardId: id },
    });

    // Delete the dashboard
    await prisma.dashboard.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Dataset deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to delete dataset" },
      { status: 500 }
    );
  }
}
