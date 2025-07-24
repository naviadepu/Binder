import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
});

import "./globals.css";
import Header from "./components/header";


export const metadata: Metadata = {
  title: "Binder",
  description: "Binder - Your Comprehensive Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
      </head>
      <body className={`min-h-screen bg-black text-white m-0 ${jetbrains.variable} font-mono`}>
        <Header />
        <main className="relative min-h-screen flex items-center justify-center">
          <div className="fixed inset-0 bg-gradient-to-br from-purple-600/20 via-red-500/20 to-teal-500/20" />
          <div className="relative z-10 w-full max-w-7xl px-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}