'use client';
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);
  const scrollToContent = () => {
    document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Hero Section - Full Height */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">
            Your digital companion for<br />seamless learning
          </h1>
          <p className="text-xl mb-8">
            Efficiently manage your courses, schedule and chatbot all in one place.
          </p>
          <div className="space-x-4">
          <Link href={isLoggedIn ? "/dashboard" : "/signin"}>
            <button className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105 inline-flex items-center">
            Get Started
          <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
          </Link>

            <button 
              onClick={scrollToContent}
              className="text-white bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Learn More Section - Full Height */}
      <div id="learn-more" className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative">
          <svg
            className="absolute -top-4 -left-4 w-8 h-8 text-white/20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-white/90 text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-light border-l-4 border-white/20 pl-6 py-2">
            <p className="mb-8">
              Binder is your all-in-one academic companion that seamlessly integrates course management, 
              scheduling, and AI-powered assistance. With an intuitive interface and smart features, 
              it helps you stay organized and excel in your academic journey.
            </p>
            <footer className="text-white/70 text-xl sm:text-2xl mt-4">
               Your Academic Success Partner
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
