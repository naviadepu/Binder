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
  };

  const handleOpenSettings = () => {
    setDisplayName(user?.displayName || '');
    setPhotoURL(user?.photoURL || '');
    setShowSettings(true);
    setMenuOpen(false);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
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
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center">
          <div className="flex-none">
            <Link href="/" className="text-white font-semibold text-3xl tracking-tighter hover:text-white hover:opacity-90 transition-all">
              BINDER
            </Link>
          </div>
          <div className="flex-1 flex justify-center items-center gap-12">
            <Link 
              href="/signin" 
              className="px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
            >
              Courses
            </Link>
            <Link 
              href="/signin" 
              className="px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
            >
              Schedule
            </Link>
            <Link 
              href="/signin" 
              className="px-4 py-2 rounded-lg text-white/75 hover:text-black hover:bg-white text-lg font-medium transition-all"
            >
              Chatbot
            </Link>
          </div>
          <div className="flex-none relative" ref={menuRef}>
            {user ? (
              <button
                className="bg-white hover:bg-white/90 text-black px-3 py-2 rounded-full text-base font-medium transition-colors flex items-center gap-2 focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="User menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <Link href="/signin">
                <button className="bg-white hover:bg-white/90 text-black px-5 py-2 rounded-lg text-base font-medium transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  Sign In
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
      </nav>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10 text-black">
            <h2 className="text-xl font-bold mb-4">User Settings</h2>
            <label className="block text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              disabled={saving}
            />
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="w-full mb-4"
              onChange={handleFileChange}
              disabled={saving}
            />
            {photoURL && (
              <div className="flex justify-center mb-4">
                <img src={photoURL} alt="Preview" width={64} height={64} className="rounded-full object-cover" />
              </div>
            )}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-medium transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                disabled={saving || !displayName.trim()}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
