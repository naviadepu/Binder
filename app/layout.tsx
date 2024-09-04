import type { Metadata } from "next";
import Header from "./components/header";
import { Bodoni_Moda } from "@next/font/google";

import "./globals.css";

// Define the font loader at the module scope
const bodoniModa = Bodoni_Moda({ weight: '700', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "Binder",
  description: "Binder - Your Comprehensive Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodoniModa.className} bg-white min-h-screen`}>
        <Header /> {/* Header is always visible */}
        <main className="p-4">
          {children} {/* Main content area */}
        </main>
      </body>
    </html>
  );
}
