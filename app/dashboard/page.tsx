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

  const dashboardCards = [
    {
      title: "Get Your Recommendations",
      description: "Discover personalized course suggestions and academic resources tailored to your interests and goals.",
      icon: SparklesIcon,
      href: "/recommendations",
      gradient: "from-purple-600/20 to-pink-600/20",
      hoverGradient: "hover:from-purple-600/30 hover:to-pink-600/30"
    },
    {
      title: "Create Schedule",
      description: "Plan and organize your academic calendar with smart scheduling tools and reminders.",
      icon: CalendarDaysIcon,
      href: "/schedule",
      gradient: "from-blue-600/20 to-cyan-600/20",
      hoverGradient: "hover:from-blue-600/30 hover:to-cyan-600/30"
    },
    {
      title: "Chatbot",
      description: "Get instant help and answers to your academic questions with our AI-powered assistant.",
      icon: ChatBubbleLeftRightIcon,
      href: "/chat",
      gradient: "from-green-600/20 to-teal-600/20",
      hoverGradient: "hover:from-green-600/30 hover:to-teal-600/30"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Welcome Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-white">
          Welcome back, {getUserDisplayName()}!
        </h1>
        <p className="text-xl text-white/80">
          Ready to continue your academic journey? Choose what you'd like to do today.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Link key={index} href={card.href}>
              <div className={`
                relative group cursor-pointer
                bg-gradient-to-br ${card.gradient}
                backdrop-blur-sm border border-white/10
                rounded-2xl p-8 h-80
                transition-all duration-300 ease-out
                transform hover:scale-105 ${card.hoverGradient}
                hover:border-white/20 hover:shadow-2xl
              `}>
                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-white transition-colors duration-300">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-base leading-relaxed mb-6 flex-grow">
                    {card.description}
                  </p>

                  {/* Arrow Icon */}
                  <div className="flex items-center text-white/60 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-medium mr-2">Get Started</span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats or Additional Info */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
          <span className="text-white/80 text-sm">
            All systems operational • Last login: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
