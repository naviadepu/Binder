import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";

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
      <body className={`min-h-screen bg-black text-white m-0 ${jetbrains.variable} font-mono`}>
        <nav className="fixed top-0 w-full backdrop-blur-sm bg-black/90 border-b border-white/10 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center">
            <div className="flex-none">
              <Link href="/" className="text-white font-semibold text-3xl tracking-tighter hover:text-white hover:opacity-90 transition-all">
                BINDER
              </Link>
            </div>
            <div className="flex-1 flex justify-center items-center gap-12">
              <Link 
                href="/courses" 
                className="px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
              >
                Courses
              </Link>
              <Link 
                href="/schedule" 
                className="px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
              >
                Schedule
              </Link>
              <Link 
                href="/chat" 
                className="px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
              >
                Chatbot
              </Link>
            </div>
            {/*
            <div className="flex-none">
              <button className="bg-white hover:bg-white/90 text-black px-5 py-2 rounded-lg text-base font-medium transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
                Sign In
              </button>
            </div>
            */}
          </div>
        </nav>
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
