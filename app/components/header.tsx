"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	// Menu closing upon clicking off, or pressing Escape
	useEffect(() => {
		const listener = () => {
			setMenuOpen(false);
		};
		const keyListener = (ev: KeyboardEvent) => {
			console.log(ev.key);

			if (ev.key === "Escape") {
				setMenuOpen(false);
			}
		};
		document.body.addEventListener("click", listener);
		document.body.addEventListener("keydown", keyListener);

		return () => {
			document.body.removeEventListener("click", listener);
			document.body.removeEventListener("keypress", keyListener);
		};
	});

	return (
		<header className='p-4 flex items-center justify-between bg-transparent border-b border-gray-600'>
			{/* Left: Binder Logo and Name */}
			<div className='flex items-center'>
				<Image
					src='/binder.png'
					alt='Binder logo'
					width={60}
					height={60}
					className='cursor-pointer transition-opacity duration-200 hover:opacity-80'
				/>
			</div>
			{/* Center: Navigation Links */}
			<nav className='flex space-x-8'>
				{/* Courses Button */}
				<Link href='/courses'>
				<span className='text-gray-200 text-lg font-extrabold relative top-5 transition-all duration-200 ease-in-out hover:text-white hover:underline'>
						Courses
					</span>
				</Link>
				{/* Schedule Button */}
				<span className='text-gray-200 text-lg font-extrabold relative top-5 transition-all duration-200 ease-in-out hover:text-white hover:underline'>
					Schedule
					</span>
				{/* Chat Button */}
				<span className='text-gray-200 text-lg font-extrabold relative top-5 transition-all duration-200 ease-in-out hover:text-white hover:underline'>
					Chat
					</span>
			</nav>

			{/* Right: User Avatar */}
			<div className='relative'>
				<button onClick={() => setMenuOpen(!menuOpen)}>
					<Avatar>
						<AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</button>
				{menuOpen ? (
					<>
						<div className='absolute right-0 bg-white p-5'>Menu</div>
					</>
				) : null}
			</div>
		</header>
	);
}

export default Header;
