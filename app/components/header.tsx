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
					<button className='bg-salmonpink relative px-6 py-3 text-lg font-semibold text-black rounded-lg overflow-hidden group'>
						<span className='absolute inset-0 bg-sky-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out'></span>
						<span className='relative'>Courses</span>
					</button>
				</Link>
				{/* Map Button */}
				<button className='bg-salmonpink relative px-6 py-3 text-lg font-semibold text-black rounded-lg overflow-hidden group'>
					<span className='absolute inset-0 bg-sky-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out'></span>
					<span className='relative'>Map</span>
				</button>
				{/* Schedule Button */}
				<button className='bg-salmonpink relative px-6 py-3 text-lg font-semibold text-black rounded-lg overflow-hidden group'>
					<span className='absolute inset-0 bg-sky-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out'></span>
					<span className='relative'>Schedule</span>
				</button>
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
