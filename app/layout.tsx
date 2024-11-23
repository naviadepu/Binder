import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
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
      <body className={`min-h-screen bg-black m-0 ${inter.variable}`}>
        <nav className="fixed top-0 w-full backdrop-blur-sm bg-black/90 border-b border-white/10 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-white font-semibold text-2xl tracking-tight hover:text-white/90 transition-colors">
                Binder
              </Link>
            </div>
            <div className="flex items-center gap-8">
              <Link 
                href="/courses" 
                className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 text-base font-medium transition-all"
              >
                Courses
              </Link>
              <Link 
                href="/schedule" 
                className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 text-base font-medium transition-all"
              >
                Schedule
              </Link>
              <Link 
                href="/chatbot" 
                className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 text-base font-medium transition-all"
              >
                Chatbot
              </Link>
              <button className="bg-white hover:bg-white/90 text-black px-5 py-2 rounded-lg text-base font-medium transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </nav>
        <main className="relative pt-20 text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-red-500/20 to-green-500/20 pointer-events-none" />
          {children}
        </main>
      </body>
    </html>
  );
}
