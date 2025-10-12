import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, fileUrl, fileType, headers, rows } = body;

    if (!name || !fileUrl || !headers || !rows) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        userId: session.user.id,
        name,
        description: description || null,
        data: {
          fileUrl,
          fileType,
          headers,
          rows,
          totalRows: rows.length,
          totalColumns: headers.length,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("[DASHBOARD_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const dashboards = await prisma.dashboard.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(dashboards);
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
