"use client";

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, User, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';

function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setDisplayName(currentUser?.displayName || '');
      setPhotoURL(currentUser?.photoURL || '');
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    await signOut(auth);
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleOpenSettings = () => {
    setDisplayName(user?.displayName || '');
    setPhotoURL(user?.photoURL || '');
    setShowSettings(true);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFileName('');
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName, photoURL });
      setShowSettings(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
    setSaving(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full backdrop-blur-sm bg-black/90 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
          <div className="flex-none">
            <Link href="/" className="text-white font-semibold text-2xl sm:text-3xl tracking-tighter hover:text-white hover:opacity-90 transition-all">
              BINDER
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-12">
            <Link 
              href={user ? "/courses" : "/signin"} 
              className="px-3 sm:px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-base sm:text-lg font-medium transition-all"
            >
              Courses
            </Link>
            <Link 
              href={user ? "/schedule" : "/signin"} 
              className="px-3 sm:px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-base sm:text-lg font-medium transition-all"
            >
              Schedule
            </Link>
            <Link 
              href={user ? "/chat" : "/signin"} 
              className="px-3 sm:px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-base sm:text-lg font-medium transition-all"
            >
              Chatbot
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block flex-none relative" ref={menuRef}>
            {user ? (
              <button
                className="px-3 py-2 rounded-full text-base font-medium transition-colors flex items-center gap-2 focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="User menu"
              >
                {photoURL ? (
                  <img src={photoURL} alt="User Avatar" width={40} height={40} className="rounded-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ) : (
              <Link href="/signin">
                <button className="bg-white hover:bg-white/90 text-black px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </Link>
            )}
            {menuOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 text-black">
                <div className="px-4 py-2 text-sm font-semibold border-b border-gray-200">{user.displayName || user.email}</div>
                <button
                  onClick={handleOpenSettings}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href={user ? "/courses" : "/signin"} 
                className="block px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href={user ? "/schedule" : "/signin"} 
                className="block px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link 
                href={user ? "/chat" : "/signin"} 
                className="block px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Chatbot
              </Link>
              
              {/* Mobile User Section */}
              {user ? (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {photoURL ? (
                      <img src={photoURL} alt="User Avatar" width={32} height={32} className="rounded-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white/75">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-white/75 text-sm">{user.displayName || user.email}</span>
                  </div>
                  <button
                    onClick={handleOpenSettings}
                    className="w-full text-left px-4 py-2 text-white/75 hover:text-black hover:bg-white rounded-lg transition-all"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-white/75 hover:text-black hover:bg-white rounded-lg transition-all"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10">
                  <Link href="/signin">
                    <button 
                      className="w-full bg-white hover:bg-white/90 text-black px-4 py-2 rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                      Sign In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#181028] border border-purple-700 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl text-white relative">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-purple-300">User Settings</h2>
            <label className="block text-white/80 mb-2">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 mb-5"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              disabled={saving}
            />
            <label className="block text-white/80 mb-2">Profile Picture</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
              <label className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition font-medium text-sm sm:text-base">
                Choose a file
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={saving}
                />
              </label>
              <span className="text-white/60 text-xs sm:text-sm">{selectedFileName || 'No file chosen'}</span>
            </div>
            {photoURL && (
              <div className="flex justify-center mb-5">
                <img src={photoURL} alt="Preview" width={72} height={72} className="rounded-full object-cover" />
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 mt-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition"
                disabled={saving || !displayName.trim()}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
            <button
              className="absolute top-3 right-3 text-white/60 hover:text-white text-xl font-bold focus:outline-none"
              onClick={() => setShowSettings(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
