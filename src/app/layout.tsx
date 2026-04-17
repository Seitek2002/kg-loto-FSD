import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import localFont from "next/font/local";

import { BottomNav } from "@/widgets/BottomNav/BottomNav";
import { HeaderWidget } from "@/widgets/Header";

import { LiquidFilterDef } from "@/shared/ui/LiquidFilterDef";

import "./globals.css";
import QueryProvider from "./providers/QueryProvider";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const benzin = localFont({
  src: [
    { path: "../font/Benzin-Regular.woff2", weight: "400", style: "normal" },
    { path: "../font/Benzin-Medium.woff2", weight: "500", style: "normal" },
    { path: "../font/Benzin-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../font/Benzin-Bold.woff2", weight: "700", style: "normal" },
    { path: "../font/Benzin-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-benzin",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "KGLOTO",
  description: "Лотерея KGLOTO",
  icons: { icon: "/favicon.png" },
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${rubik.variable} ${benzin.variable} antialiased font-rubik bg-[#F5F5F5]`}
      >
        <QueryProvider>
          <LiquidFilterDef />

          <div className="relative flex flex-col h-dvh overflow-hidden">
            <HeaderWidget />

            <main className="flex-1 w-full mx-auto overflow-y-auto scrollbar-hide pb-24">
              {children}
            </main>

            <BottomNav />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
