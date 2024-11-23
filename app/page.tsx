'use client';
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Home() {

  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="relative">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">
          Your digital companion for<br />seamless learning
        </h1>
        <p className="text-xl mb-8">
          Efficiently manage your courses, schedule and chatbot all in one place.
        </p>
        <div className="space-x-4">
          <Link href="/courses">
            <button className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105 inline-flex items-center">
              Get Started
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </Link>
          <button 
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="text-white bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Learn More Modal/Content */}
      {showLearnMore && (
        <div className="mt-8 max-w-2xl mx-auto">
          <blockquote className="text-white/90 text-xl leading-relaxed font-light border-l-4 border-white/20 pl-6 py-2">
            <p className="mb-4">
              Binder is your all-in-one academic companion that seamlessly integrates course management, 
              scheduling, and AI-powered assistance. With an intuitive interface and smart features, 
              it helps you stay organized and excel in your academic journey.
            </p>
            <footer className="text-white/70 text-base mt-2">
              — Your Academic Success Partner
            </footer>
          </blockquote>
        </div>
      )}
    </div>
  );
}
