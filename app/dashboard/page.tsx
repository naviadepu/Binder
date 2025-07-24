'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';
import { 
  SparklesIcon, 
  CalendarDaysIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

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
      <div className="w-full max-w-2xl px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome, {getUserDisplayName()}!</h1>
          <p className="text-base text-white/70">Ready to continue your academic journey? Choose what you'd like to do today.</p>
        </div>
        <div className="flex flex-col space-y-6 w-full">
          {/* AI Recommendations Card */}
          <Link href="/courses" className="group">
            <div className="flex flex-row items-center border border-white/20 rounded-2xl bg-gradient-to-r from-purple-900/60 via-black/40 to-purple-800/40 backdrop-blur-lg p-6 shadow-xl transition hover:scale-[1.02] hover:border-purple-400/60 hover:shadow-purple-500/30 ring-1 ring-white/10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 transition shadow-lg ring-2 ring-purple-400/30 mr-6">
                <SparklesIcon className="w-8 h-8 text-purple-300 drop-shadow" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg tracking-tight">AI Recommendations</h3>
                <p className="text-white/80 text-sm leading-relaxed">Discover personalized course suggestions and academic resources tailored to your interests and goals.</p>
              </div>
              <div className="flex items-center ml-6 text-purple-200 group-hover:text-purple-300 transition font-semibold text-base">
                <span className="mr-2">Go</span>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            </div>
          </Link>
          {/* Create Schedule Card */}
          <Link href="/schedule" className="group">
            <div className="flex flex-row items-center border border-white/20 rounded-2xl bg-gradient-to-r from-cyan-900/60 via-black/40 to-cyan-800/40 backdrop-blur-lg p-6 shadow-xl transition hover:scale-[1.02] hover:border-cyan-400/60 hover:shadow-cyan-500/30 ring-1 ring-white/10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/40 transition shadow-lg ring-2 ring-cyan-400/30 mr-6">
                <CalendarDaysIcon className="w-8 h-8 text-cyan-300 drop-shadow" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg tracking-tight">Create Schedule</h3>
                <p className="text-white/80 text-sm leading-relaxed">Plan and organize your academic calendar with smart scheduling tools and reminders.</p>
              </div>
              <div className="flex items-center ml-6 text-cyan-200 group-hover:text-cyan-300 transition font-semibold text-base">
                <span className="mr-2">Go</span>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            </div>
          </Link>
          {/* Chatbot Card */}
          <Link href="/chat" className="group">
            <div className="flex flex-row items-center border border-white/20 rounded-2xl bg-gradient-to-r from-green-900/60 via-black/40 to-green-800/40 backdrop-blur-lg p-6 shadow-xl transition hover:scale-[1.02] hover:border-green-400/60 hover:shadow-green-500/30 ring-1 ring-white/10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition shadow-lg ring-2 ring-green-400/30 mr-6">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-300 drop-shadow" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg tracking-tight">Chatbot</h3>
                <p className="text-white/80 text-sm leading-relaxed">Get instant help and answers to your academic questions with our AI-powered assistant.</p>
              </div>
              <div className="flex items-center ml-6 text-green-200 group-hover:text-green-300 transition font-semibold text-base">
                <span className="mr-2">Go</span>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
