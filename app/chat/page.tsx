'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { SendHorizontal, Upload } from 'lucide-react'

export default function Page() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      console.log('API Key exists:', !!apiKey); // Debug log (don't log the actual key)

      if (!apiKey) {
        throw new Error("API key not found");
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
      console.log('Making request to Gemini API...'); // Debug log

      const requestBody = {
        contents: [{
          parts: [{
            text: inputMessage
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('Request body:', requestBody); // Debug log

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText); // Debug log
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('AI Response:', aiResponse); // Debug log

      // Add AI response to chat
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      setInputMessage('');

    } catch (error) {
      console.error('Error in sendMessage:', error); // Debug log
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
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
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