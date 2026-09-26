"use client";

import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { HabitEvent } from "@prisma/client";

interface CalendarTrackerProps {
  events: HabitEvent[];
}

export function CalendarTracker({ events }: CalendarTrackerProps) {
  // Extract dates
  const successDates = events.filter((e) => e.type === "SUCCESS").map((e) => new Date(e.eventDate));
  const relapseDates = events.filter((e) => e.type === "RELAPSE").map((e) => new Date(e.eventDate));

  const isRelapseDate = (date: Date) => relapseDates.some((d) => isSameDay(d, date));

  const isSuccessDate = (date: Date) => {
    if (isRelapseDate(date)) return false;
    if (successDates.some((d) => isSameDay(d, date))) return true;
    
    if (events.length > 0) {
      const firstEventDate = new Date(events[events.length - 1].eventDate);
      const today = new Date();
      const timeToCheck = new Date(date).setHours(0, 0, 0, 0);
      const startTime = new Date(firstEventDate).setHours(0, 0, 0, 0);
      const endTime = new Date(today).setHours(0, 0, 0, 0);
      return timeToCheck >= startTime && timeToCheck <= endTime;
    }
    return false;
  };

  return (
    <Calendar
      mode="multiple"
      // We don't allow actual selection via internal state, we just display
      selected={[]}
      modifiers={{
        success: isSuccessDate,
        relapse: isRelapseDate,
      }}
      modifiersClassNames={{
        success: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-bold",
        relapse: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-bold",
      }}
      components={{
        DayButton: (props) => {
          // Find if this day has an event
          const isSuccess = isSuccessDate(props.day.date);
          const isRelapse = isRelapseDate(props.day.date);
          
          let content = null;
          if (isSuccess) content = "✓";
          if (isRelapse) content = "✕";
          
          return (
            <button
              {...props}
              className={`${props.className} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:z-10 rounded-2xl active:scale-90`}
            >
              <span className="text-xl sm:text-2xl font-bold font-sans tracking-tight">{props.day.date.getDate()}</span>
              <span className={`text-3xl sm:text-5xl leading-none mt-1 sm:mt-2 absolute opacity-80 ${isSuccess ? 'text-green-500' : isRelapse ? 'text-red-500' : 'hidden'} animate-in zoom-in spin-in-12 duration-500`}>
                  {content}
              </span>
            </button>
          );
        },
      }}
      className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-[3rem] border-4 border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 sm:p-12 mx-auto w-full max-w-4xl [--cell-size:4rem] sm:[--cell-size:6rem] sm:text-xl relative isolate"
    />
  );
}
