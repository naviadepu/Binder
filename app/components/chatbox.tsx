'use client'
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

// Add TypeScript declaration for window.puter
declare global {
  interface Window {
    puter: any;
  }
}

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hi! How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMsg = message;
      setChat(prev => [...prev, { sender: 'user', text: userMsg }]);
      setMessage('');
      setLoading(true);
      try {
        if (typeof window !== 'undefined' && window.puter) {
          const res = await window.puter.ai.chat(userMsg, { model: 'gpt-4.1-nano' });
          setChat(prev => [...prev, { sender: 'ai', text: res }]);
        } else {
          setChat(prev => [...prev, { sender: 'ai', text: 'Puter.js not loaded.' }]);
        }
      } catch (err) {
        setChat(prev => [...prev, { sender: 'ai', text: 'Error getting response.' }]);
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`bg-white rounded-lg shadow-lg ${isOpen ? 'w-80' : 'w-auto'}`}>
        <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
          <h3 className="font-semibold">Melos</h3>
          <button 
            className="px-4 py-1 rounded hover:bg-blue-700 transition-colors"
            onClick={toggleChatbox}
          >
            {isOpen ? '×' : 'Chat'}
          </button>
        </div>
        {isOpen && (
          <div className="p-4">
            <div className="h-64 overflow-y-auto mb-4 space-y-2 flex flex-col">
              {chat.map((msg, idx) => (
                <div key={idx} className={msg.sender === 'user' ? 'self-end' : 'self-start'}>
                  <p className={`p-2 rounded max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>{msg.text}</p>
                </div>
              ))}
              {loading && <p className="text-gray-400">Melos is typing...</p>}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox