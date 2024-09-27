import type { Metadata } from "next";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

import "./globals.css";
import Header from "./components/header";


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
      <body className={`${poppins.variable} antialiased flex flex-col bg-back h-dvh max-w-screen py-10 relative`}>
		<div className="absolute w-full top-0">
			<Header/>
		</div>
		<main>
			{children}
		</main>
      </body>
    </html>
  );
}
