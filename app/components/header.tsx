import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

function Header() {
  return (
    <header className="p-4 flex items-center justify-between bg-transparent shadow-md">
      {/* Left: Binder Logo and Name */}
      <div className="flex items-center">
        <Image
          src="/new.png"
          alt="Binder logo"
          width={60}
          height={60}
          className="rounded-full cursor-pointer transition-opacity duration-200 hover:opacity-80"
        />
        <span className="text-black font-bold text-3xl ml-2 tracking-tight transition-colors duration-200">
          BINDER.
        </span>
      </div>

      {/* Center: Navigation Links */}
      <nav className="flex space-x-8">
        {/* Courses Button */}
        <Link href="/courses">
          <button className="relative px-6 py-3 text-lg font-semibold text-black border border-sky-300 rounded-lg overflow-hidden group">
            <span className="absolute inset-0 bg-sky-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            <span className="relative">Courses</span>
          </button>
        </Link>
        {/* Map Button */}
        <button className="relative px-6 py-3 text-lg font-semibold text-black border border-sky-300 rounded-lg overflow-hidden group">
          <span className="absolute inset-0 bg-sky-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
          <span className="relative">Map</span>
        </button>
        {/* Schedule Button */}
        <button className="relative px-6 py-3 text-lg font-semibold text-black border border-sky-300 rounded-lg overflow-hidden group">
          <span className="absolute inset-0 bg-sky-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
          <span className="relative">Schedule</span>
        </button>
      </nav>

      {/* Right: User Avatar */}
      <Image
        src="/user.png"
        alt="User avatar"
        width={50}
        height={50}
        className="rounded-full cursor-pointer transition-opacity duration-200 hover:opacity-80"
      />
    </header>
  );
}

export default Header;
