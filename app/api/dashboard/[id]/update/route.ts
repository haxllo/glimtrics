import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
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

    // Update the dashboard
    const updated = await prisma.dashboard.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      dashboard: updated,
    });
  } catch (error) {
    console.error("Update dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to update dataset" },
      { status: 500 }
    );
  }
}
