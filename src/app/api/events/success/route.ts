import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Server time in IST
    const now = new Date();
    const istTime = toZonedTime(now, "Asia/Kolkata");
    // Start of the day in IST (for eventDate)
    const eventDate = startOfDay(istTime);

    // Check if an event already exists for today
    const existing = await db.habitEvent.findFirst({
      where: {
        userId,
        eventDate: eventDate,
      },
    });

    if (existing) {
      return new NextResponse("Event already recorded for today", { status: 400 });
    }

    const event = await db.habitEvent.create({
      data: {
        userId,
        type: "SUCCESS",
        eventDate: eventDate,
        occurredAt: now, // store UTC actual time
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_SUCCESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
