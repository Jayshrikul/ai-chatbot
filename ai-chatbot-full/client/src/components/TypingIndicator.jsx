import React, { useEffect } from "react";
import "../styles/TypingIndicator.css";

const TypingIndicator = ({ isTyping, onTimeout, duration = 5000 }) => {
  useEffect(() => {
    if (!onTimeout) return;
    const timer = setTimeout(() => {
      onTimeout();
    }, duration);

    return () => clearTimeout(timer);
  }, [onTimeout, duration]);

  if (!isTyping) return null; // Only render if typing

  return (
    <div className="message bot typing">
      <div className="typing-indicator">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
