'use client'

import React from 'react'
import Image from 'next/image'
import { SendHorizontal, Upload, BookOpen, Search, GraduationCap } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 font-poppins overflow-y-auto">
      {/* Upload Button at Top */}
      <div className="mb-6">
        <button className="bg-gray-800/70 hover:bg-gray-700/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Upload size={20} />
          Upload File
        </button>
      </div>

      {/* Initial Bot Message */}
      <div className="mb-8">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-gray-300 mb-6 text-center">Hi! I'm Melos, I can:</h2>
          
          {/* Capabilities Cards Grid - Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {/* Course Selection Card */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 w-full max-w-[300px] hover:bg-gray-700/30 transition-colors cursor-pointer">
              <div className="mb-4">
                <div className="bg-cyan-500/20 p-3 rounded-xl w-fit">
                  <GraduationCap className="text-cyan-500 w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-400 text-lg">Help you with your course selection</p>
            </div>

            {/* Course Search Card */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 w-full max-w-[300px] hover:bg-gray-700/30 transition-colors cursor-pointer">
              <div className="mb-4">
                <div className="bg-pink-500/20 p-3 rounded-xl w-fit">
                  <Search className="text-pink-500 w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-400 text-lg">Search anything from your courses</p>
            </div>

            {/* Course Suggestions Card */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 w-full max-w-[300px] hover:bg-gray-700/30 transition-colors cursor-pointer">
              <div className="mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl w-fit">
                  <BookOpen className="text-purple-500 w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-400 text-lg">Suggest courses based on your interests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-6 left-6 right-6 max-w-[800px] mx-auto">
        <div className="bg-gray-800/70 rounded-lg p-4 flex items-center gap-4">
          <Image
            src="/melos.png"
            alt="Melos"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <input 
            type="text"
            placeholder="Ask me anything..."
            className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="text-white hover:text-white/80 transition-colors">
            <SendHorizontal size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}