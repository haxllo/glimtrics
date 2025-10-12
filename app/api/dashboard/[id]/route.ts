import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        insights: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!dashboard) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("[DASHBOARD_GET_BY_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.dashboard.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DASHBOARD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
