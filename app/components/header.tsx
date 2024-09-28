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
		<header className='p-2 mt-10 flex items-center justify-between bg-white rounded-3xl shadow-md mx-7'>
			{/* Left: Binder Logo and Name */}
			<div className='flex items-center'>
			<Link href={'/'}>
				<Image
					src='/binder.png?v=1'
					alt='Binder logo'
					width={60}
					height={60}
					className='cursor-pointer transition-opacity duration-200 hover:opacity-80'
				/>
			</Link>
			</div>
			{/* Center: Navigation Links */}
			<nav className='flex space-x-11'>
				{/* Courses Button */}
				<Link href='/courses'>
					<span className='text-[#543D75] text-lg font-extrabold transition-all duration-200 ease-in-out ma hover:text-black hover:underline'>
						Courses
					</span>
				</Link>
				{/* Schedule Button */}
				<Link href='/schedule'>
					<span className='text-[#543D75] text-lg font-extrabold transition-all duration-200 ease-in-out hover:text-black hover:underline'>
						Schedule
					</span>
				</Link>
				{/* Chat Button */}
				<Link href='/chat'>
					<span className='text-[#543D75] text-lg font-extrabold transition-all duration-200 ease-in-out hover:text-black hover:underline'>
						Chat
					</span>
				</Link>
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
