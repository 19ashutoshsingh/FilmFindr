import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatPopup from "./ChatPopup";

const ChatButton = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <button
        onClick={() => setShowPopup((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-xl hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer"
        title="Chat with FilmFindr"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Popup */}
      {showPopup && (
        <div className="fixed bottom-24 right-6 z-50">
          <ChatPopup onClose={handleClose} />
        </div>
      )}
    </>
  );
};

export default ChatButton;
