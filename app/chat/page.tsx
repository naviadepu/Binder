'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { SendHorizontal, Upload, ArrowRight, CalendarPlus, Eye } from 'lucide-react'

// Enhanced formatting for AI responses: bold headings, underline/color links, better lists
function formatAIResponse(text: string) {
  let formatted = text
    // Bold headings (lines ending with ':')
    .replace(/^(.*?):\s*$/gm, '<strong class="font-bold text-lg">$1:</strong>')
    // Underline and color links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="underline text-blue-400 hover:text-blue-600" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bold markdown **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Numbered lists: add margin
    .replace(/(\d+\. .+)/g, '<div class="ml-4 my-1">$1</div>')
    // Bulleted lists: add margin
    .replace(/(\- .+)/g, '<div class="ml-4 my-1">$1</div>')
    // Newlines to <br>
    .replace(/\n/g, '<br>');
  return formatted;
}

export default function Page() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAddedCourses, setHasAddedCourses] = useState(false); // Track if courses have been added

  // Simulate adding courses (replace with real logic as needed)
  const handleAddCourses = () => {
    setHasAddedCourses(true);
  };

  // Simulate viewing schedule (replace with real navigation as needed)
  const handleViewSchedule = () => {
    window.location.href = '/schedule';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
      setInputMessage('');

      // Context-aware: Concatenate last 10 messages for context
      // Downside: Large/long conversations can make the prompt very long, increasing latency and cost, and may hit model context limits.
      // Only the last 10 exchanges are included for efficiency.
      const contextMessages = [...messages, { text: inputMessage, isUser: true }].slice(-10);
      const contextPrompt = contextMessages
        .map(m => (m.isUser ? 'User: ' : 'Assistant: ') + m.text)
        .join('\n');

      // Use Puter.js for AI response with context
      if (typeof window === 'undefined' || !window.puter) {
        setMessages(prev => [...prev, { text: "Puter.js not loaded.", isUser: false }]);
        setIsLoading(false);
        return;
      }
      const response = await window.puter.ai.chat(contextPrompt, { model: 'gpt-4.1-nano' });
      const aiResponse = typeof response === 'string'
        ? response
        : response.message?.content || response.text || response.message || '';

      // Add AI response to chat (sanitize markdown bold)
      const sanitizedResponse = aiResponse.replace(/\*\*/g, '');
      setMessages(prev => [...prev, { text: sanitizedResponse, isUser: false }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 font-poppins overflow-y-auto">
      <div className="max-w-[800px] mx-auto">
        {/* Initial Bot Message */}
        <div className="mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 max-w-[600px]">
            <h2 className="text-gray-300 mb-4">Hi! I'm Melos..., I can:</h2>
            {/* Modernized Capabilities Flow */}
            <div className="flex flex-col gap-6">
              {/* Modern flow: Add → View */}
              <div className="flex items-center justify-center gap-4">
                {/* Add Courses Button (only if not added) */}
                {!hasAddedCourses && (
                  <>
                    <button
                      onClick={handleAddCourses}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors"
                    >
                      <CalendarPlus size={20} />
                      Add courses to schedule
                    </button>
                    {/* Arrow between buttons */}
                    <ArrowRight size={28} className="mx-2 text-black" />
                    <button
                      onClick={handleViewSchedule}
                      className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors"
                    >
                      <Eye size={20} />
                      View schedule
                    </button>
                  </>
                )}
                {/* View Schedule Button (only after adding courses) */}
                {hasAddedCourses && (
                  <button
                    onClick={handleViewSchedule}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors"
                  >
                    <Eye size={20} />
                    View schedule
                  </button>
                )}
              </div>
              {/* Capabilities List (optional, can keep for info) */}
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
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-20"> {/* Added mb-20 for spacing from input */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.isUser 
                    ? 'bg-blue-500/80 text-white' 
                    : 'bg-gray-800/70 text-gray-200'
                }`}
              >
                {message.isUser ? (
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                ) : (
                  <div className="whitespace-pre-wrap break-words text-white/90" dangerouslySetInnerHTML={{ __html: formatAIResponse(message.text) }} />
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/70 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="fixed bottom-6 left-6 right-6 max-w-[800px] mx-auto">
          <div className="bg-gray-800/70 rounded-lg p-4 flex items-center gap-4">
            {/* Replace Melos image with a nice icon */}
            <div className="bg-blue-500/80 p-2 rounded-full flex items-center justify-center">
              <SendHorizontal size={28} className="text-white" />
            </div>
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="Ask me anything..."
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="text-white hover:text-white/80 transition-colors disabled:opacity-50"
            >
              <SendHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}