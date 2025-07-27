'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';
import { 
  SparklesIcon, 
  CalendarDaysIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/signin');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getUserDisplayName = () => {
    if (user.displayName) {
      return user.displayName.split(' ')[0]; // Get first name
    }
    if (user.email) {
      return user.email.split('@')[0]; // Get username from email
    }
    return 'User';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome, {getUserDisplayName()}!</h1>
          <p className="text-sm sm:text-base text-white/70">Ready to continue your academic journey? Choose what you'd like to do today.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {/* AI Recommendations Card */}
          <Link href="/courses" className="group">
            <div className="h-full flex flex-col border border-white/20 rounded-2xl bg-gradient-to-r from-purple-900/60 via-black/40 to-purple-800/40 backdrop-blur-lg p-4 sm:p-6 shadow-xl transition hover:scale-[1.02] hover:border-purple-400/60 hover:shadow-purple-500/30 ring-1 ring-white/10">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 transition shadow-lg ring-2 ring-purple-400/30 mb-4 sm:mb-6">
                <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300 drop-shadow" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white drop-shadow-lg tracking-tight">AI Recommendations</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed flex-1 mb-4">Discover personalized course suggestions and academic resources tailored to your interests and goals.</p>
                <div className="flex items-center text-purple-200 group-hover:text-purple-300 transition font-semibold text-sm sm:text-base mt-auto">
                  <span className="mr-2">Go</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Create Schedule Card */}
          <Link href="/schedule" className="group">
            <div className="h-full flex flex-col border border-white/20 rounded-2xl bg-gradient-to-r from-cyan-900/60 via-black/40 to-cyan-800/40 backdrop-blur-lg p-4 sm:p-6 shadow-xl transition hover:scale-[1.02] hover:border-cyan-400/60 hover:shadow-cyan-500/30 ring-1 ring-white/10">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/40 transition shadow-lg ring-2 ring-cyan-400/30 mb-4 sm:mb-6">
                <CalendarDaysIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300 drop-shadow" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white drop-shadow-lg tracking-tight">Create Schedule</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed flex-1 mb-4">Plan and organize your academic calendar with smart scheduling tools and reminders.</p>
                <div className="flex items-center text-cyan-200 group-hover:text-cyan-300 transition font-semibold text-sm sm:text-base mt-auto">
                  <span className="mr-2">Go</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Chatbot Card */}
          <Link href="/chat" className="group">
            <div className="h-full flex flex-col border border-white/20 rounded-2xl bg-gradient-to-r from-green-900/60 via-black/40 to-green-800/40 backdrop-blur-lg p-4 sm:p-6 shadow-xl transition hover:scale-[1.02] hover:border-green-400/60 hover:shadow-green-500/30 ring-1 ring-white/10">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition shadow-lg ring-2 ring-green-400/30 mb-4 sm:mb-6">
                <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-300 drop-shadow" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white drop-shadow-lg tracking-tight">Chatbot</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed flex-1 mb-4">Get instant help and answers to your academic questions with our AI-powered assistant.</p>
                <div className="flex items-center text-green-200 group-hover:text-green-300 transition font-semibold text-sm sm:text-base mt-auto">
                  <span className="mr-2">Go</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
