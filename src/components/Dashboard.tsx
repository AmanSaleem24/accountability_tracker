"use client";

import { useState } from "react";
import { CalendarTracker } from "@/components/CalendarTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HabitEvent } from "@prisma/client";

interface DashboardProps {
  currentStreak: number;
  longestStreak: number;
  treeStage: string;
  events: HabitEvent[];
}

export function DashboardClient({ currentStreak, longestStreak, treeStage, events }: DashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [relapseModalOpen, setRelapseModalOpen] = useState(false);

  const handleSuccess = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events/success", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Great job! Stay strong.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log success.");
    } finally {
      setLoading(false);
    }
  };

  const handleRelapse = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events/relapse", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.notificationStatus === "FAILED") {
        toast.warning("Relapse recorded, but partner notification failed to send (check SMTP configuration).");
      } else {
        toast.error("Relapse recorded. Partner notified.");
      }
      setRelapseModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log relapse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] xl:grid-cols-[1.2fr_450px] w-full h-full items-center">
      {/* Left Side: Hero Calendar */}
      <div className="w-full flex justify-center animate-in slide-in-from-left-4 duration-1000 fade-in h-full items-center">
        <CalendarTracker events={events} />
      </div>

      {/* Right Side: Stats & Logging */}
      <div className="flex flex-col gap-6 w-full h-full justify-center">
        <Card className="text-center shadow-xl border-t-8 border-t-blue-400 overflow-hidden relative rounded-[2.5rem] bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/40 dark:to-background border-x-0 border-b-0 hover:shadow-2xl transition-shadow duration-300">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay z-0" />
          <CardHeader className="relative z-10 pt-8 pb-2">
            <CardTitle className="text-lg font-bold text-blue-600 dark:text-blue-400 tracking-widest font-sans">
              CURRENT STREAK
            </CardTitle>
            <div className="text-6xl font-black py-2 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-500 drop-shadow-sm flex items-center justify-center gap-2">
              🔥 {currentStreak}
              <span className="text-2xl text-blue-400">DAYS</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex justify-center pb-8 pt-0">
            <div className="text-8xl animate-in zoom-in spin-in-12 duration-1000 drop-shadow-2xl hover:scale-110 transition-transform cursor-default select-none">
              {treeStage.split(" ")[0]}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="shadow-lg rounded-[2rem] border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors bg-white dark:bg-gray-900">
            <CardHeader className="pb-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-t-[2rem] border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <CardTitle className="text-xs font-bold text-blue-500 uppercase tracking-wider text-center">Current</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-3xl font-black text-gray-800 dark:text-gray-100">{currentStreak}</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-[2rem] border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-900 transition-colors bg-white dark:bg-gray-900">
            <CardHeader className="pb-1 bg-purple-50/50 dark:bg-purple-900/10 rounded-t-[2rem] border-b border-gray-100 dark:border-gray-800 px-4 py-3">
              <CardTitle className="text-xs font-bold text-purple-500 uppercase tracking-wider text-center">Longest</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-3xl font-black text-gray-800 dark:text-gray-100">{longestStreak}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-2xl rounded-[2.5rem] flex flex-col border-4 border-gray-50 dark:border-gray-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-bl-full -z-0" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-red-400/10 rounded-tr-full -z-0" />
          <CardHeader className="pt-6 pb-2 relative z-10">
            <CardTitle className="text-xl font-black text-center">Log Today</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 relative z-10 px-6 pb-8">
            <Button size="lg" className="w-full bg-green-500 hover:bg-green-400 text-green-950 font-black text-lg py-8 rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_4px_0_rgb(21,128,61)] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all" onClick={handleSuccess} disabled={loading}>
              🎉 STAYED ABSTINENT!
            </Button>
            <Button size="lg" variant="destructive" className="w-full bg-red-500 hover:bg-red-400 text-red-950 font-black text-lg py-8 rounded-2xl shadow-[0_8px_0_rgb(185,28,28)] hover:shadow-[0_4px_0_rgb(185,28,28)] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all" onClick={() => setRelapseModalOpen(true)} disabled={loading}>
              🥺 RELAPSED
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={relapseModalOpen} onOpenChange={setRelapseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record relapse?</DialogTitle>
            {/* Replaced DialogDescription with a simple div to avoid <p> nesting <ul> */}
            <div className="space-y-2 mt-4 text-base text-muted-foreground">
              <p>This will:</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground">
                <li>Record the current date and time</li>
                <li><strong>Notify your accountability partner</strong></li>
                <li>Reset your current streak to 0</li>
              </ul>
              <p className="font-semibold text-destructive mt-4">This notification cannot be skipped.</p>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setRelapseModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRelapse} disabled={loading}>
              Confirm Relapse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
