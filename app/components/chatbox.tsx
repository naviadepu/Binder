import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(''); // Add state for input

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message sending here
      setMessage('');
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
            <div className="h-64 overflow-y-auto mb-4 space-y-2">
              <p className="bg-gray-100 p-2 rounded">Hi! How can I help you today?</p>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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