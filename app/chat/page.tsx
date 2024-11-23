'use client'

import React from 'react'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 font-poppins overflow-y-auto">
      {/* Upload Button at Top */}
      <div className="mb-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <i className="fas fa-upload"></i>
          Upload File
        </button>
      </div>

      {/* Initial Bot Message */}
      <div className="mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 max-w-[600px]">
          <h2 className="text-gray-300 mb-4">HI! I'm Melos..., I can:</h2>
          
          {/* Capabilities List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-800/70 p-3 rounded-lg">
              <div className="bg-cyan-500/80 p-2 rounded-full">
                <i className="fas fa-info text-white"></i>
              </div>
              <p className="text-gray-300">Help you with your course selection</p>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/70 p-3 rounded-lg">
              <div className="bg-pink-500/80 p-2 rounded-full">
                <i className="fas fa-eye text-white"></i>
              </div>
              <p className="text-gray-300">Search anything from your courses</p>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/70 p-3 rounded-lg">
              <div className="bg-purple-500/80 p-2 rounded-full">
                <i className="fas fa-calendar text-white"></i>
              </div>
              <p className="text-gray-300">Suggest courses based on your interests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-6 left-6 right-6 max-w-[800px] mx-auto">
        <div className="bg-gray-800/70 rounded-lg p-4">
          <input 
            type="text"
            placeholder="Ask me anything..."
            className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}