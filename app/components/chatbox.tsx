import Image from 'next/image';
import { useState } from 'react';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbox-container">
      <div className={`chatbox ${isOpen ? 'open' : ''}`}>
        <div className="chatbox-header">
          <h3>Melos</h3>
          <button className="close-button" onClick={toggleChatbox}>
            {isOpen ? 'X' : 'Chat'}
          </button>
        </div>
        {isOpen && (
          <div className="chatbox-body">
            <div className="messages">
              <p>Hi! How can I help you today?</p>
            </div>
            <input type="text" placeholder="Type your message..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
