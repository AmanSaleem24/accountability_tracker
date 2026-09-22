import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const partner = await db.accountabilityPartner.upsert({
      where: {
        userId,
      },
      update: {
        name,
        email,
      },
      create: {
        userId,
        name,
        email,
      },
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error("[ACCOUNTABILITY_PARTNER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
