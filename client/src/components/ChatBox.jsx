import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatBox.css";
import {
  FaMicrophone,
  FaStop,
  FaPaperPlane,
  FaSun,
  FaMoon,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import useTheme from "../hooks/ThemeToggle";
import useSpeechToText from "../hooks/useSpeechToText";
import useTextToSpeech from "../hooks/useTextToSpeech";
import TypingIndicator from "./TypingIndicator";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const { theme, toggleTheme, isDark } = useTheme();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const {
    transcript,
    startListening,
    stopListening,
    isListening,
    error,
  } = useSpeechToText((result) => setMessage(result));

  const messagesEndRef = useRef(null);

  // Keep the chat scrolled to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send a message (text from input or mic)
  const handleSend = () => {
    const userText = message.trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { type: "user", text: userText }]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = `You said: "${userText}". This is the AI's reply.`;
      setMessages((prev) => [...prev, { type: "bot", text: response }]);
      speak(response); // Auto speak response
      setIsTyping(false);
    }, 1500);
  };

  // Mic button toggle
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Speaker button for replaying bot messages
  const handleSpeakerClick = (text) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <div className={`chat-container ${theme}`}>
      {/* Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title="Toggle Theme"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </button>

      <h1 className="chat-heading">AI Chatbot</h1>

      {error && <div className="error-message">🎤 Error: {error}</div>}

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            {msg.text}
            {msg.type === "bot" && (
              <button
                className="icon-button speaker"
                onClick={() => handleSpeakerClick(msg.text)}
              >
                {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-box">
        <input
          type="text"
          placeholder={isListening ? "Listening..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`chat-input ${isListening ? "listening" : ""}`}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className={`icon-button mic-button ${isListening ? "active" : ""}`}
          onClick={handleMicClick}
        >
          {isListening ? <FaStop /> : <FaMicrophone />}
        </button>
        <button className="icon-button" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
