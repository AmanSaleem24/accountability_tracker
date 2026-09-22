import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Accountability Streak Tracker",
  description: "Track your streaks with accountability",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${nunito.variable} h-full antialiased`}
      >
        <body className={`min-h-full flex flex-col font-sans selection:bg-blue-200 ${nunito.className}`}>
          {/* Sharp High-Alpha Blobs Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Green Blobs */}
            <div className="absolute top-[5%] left-[10%] w-32 h-32 rounded-full bg-[#c0dd97] opacity-90 dark:opacity-40" />
            <div className="absolute bottom-[15%] right-[8%] w-28 h-28 rounded-full bg-[#c0dd97] opacity-90 dark:opacity-40" />
            
            {/* Blue Blobs */}
            <div className="absolute top-[18%] right-[20%] w-24 h-24 rounded-full bg-[#85b7eb] opacity-90 dark:opacity-40" />
            <div className="absolute bottom-[10%] left-[18%] w-36 h-36 rounded-full bg-[#85b7eb] opacity-90 dark:opacity-40" />

            {/* Assorted Accent Blobs */}
            <div className="absolute top-[45%] left-[2%] w-16 h-16 rounded-full bg-[#d8b4e2] opacity-90 dark:opacity-40" />
            <div className="absolute top-[60%] right-[12%] w-20 h-20 rounded-full bg-[#fde047] opacity-90 dark:opacity-40" />
            <div className="absolute bottom-[35%] left-[45%] w-20 h-20 rounded-full bg-[#fca5a5] opacity-90 dark:opacity-40" />
          </div>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
