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
import useTheme from "../hooks/useTheme";
import useVoiceChat from "../hooks/useVoiceChat";
import TypingIndicator from "./TypingIndicator";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const { theme, toggleTheme, isDark } = useTheme();

  const {
    startListening,
    stopListening,
    isListening,
    error: sttError,
    speak,
    stopSpeaking,
    isSpeaking,
  } = useVoiceChat({
    onResult: (result) => setMessage(result),
    language: "en-US",
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userText = message;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (data.reply) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
          speak(data.reply);
          setIsTyping(false);
        }, 1200);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "❌ No reply from AI." },
        ]);
        setIsTyping(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to AI." },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className={`ChatBox ${theme}`}>
      {/* Header */}
      <div className="chat-header">
        <h2>AI Chat</h2>
        <button onClick={toggleTheme}>
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Messages */}
      <div className="message-list">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <TypingIndicator isTyping={isTyping} />}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="chat-input-wrapper">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className={isListening ? "listening" : ""}
        />

        {/* Send */}
        <button onClick={handleSend} className="send-btn">
          <FaPaperPlane />
        </button>

        {/* Mic */}
        <button
          onClick={isListening ? stopListening : startListening}
          className="mic-btn"
        >
          {isListening ? <FaStop /> : <FaMicrophone />}
        </button>
      </div>

      {/* Speaker controls */}
      <div className="speaker-controls">
        <button
          onClick={() => speak(message)}
          disabled={isSpeaking || !message}
          className={`icon-btn ${isSpeaking ? "active" : ""}`}
        >
          <FaVolumeUp />
        </button>
        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="icon-btn"
        >
          <FaVolumeMute />
        </button>
      </div>

      {sttError && <p className="error">STT Error: {sttError}</p>}
    </div>
  );
};

export default ChatBox;
