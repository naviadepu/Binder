import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "./components/header";
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-poppins",
});

import "./globals.css";

// Define the font loader at the module scope
// const bodoniModa = Bodoni_Moda({
// 	weight: "700",
// 	subsets: ["latin"],
// 	display: "swap",
// 	variable:
// });

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
		<html lang='en'>
			<body className={`${poppins.variable} bg-back min-h-screen mt-3`}>
				<Header /> {/* Header is always visible */}
				<main className='p-4 h-full'>
					{children} {/* Main content area */}
				</main>
			</body>
		</html>
	);
}
