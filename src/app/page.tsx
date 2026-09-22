import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { DashboardClient } from "@/components/Dashboard";
import { getStreakData } from "@/lib/streak";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if accountability partner exists
  const partner = await db.accountabilityPartner.findUnique({
    where: { userId },
  });

  if (!partner) {
    redirect("/onboarding");
  }

  const { currentStreak, longestStreak, treeStage, events } = await getStreakData(userId);

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <header className="flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-black tracking-tight text-blue-900 dark:text-blue-100">Accountability Tracker</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-gray-500 bg-white dark:bg-gray-900 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
            Partner: <span className="text-blue-600 dark:text-blue-400">{partner.name}</span>
          </div>
          <UserButton />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center pb-12">
        <DashboardClient
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          treeStage={treeStage}
          events={events}
        />
      </main>
    </div>
  );
}
