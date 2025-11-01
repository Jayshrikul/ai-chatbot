import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import useTheme from "./hooks/useTheme";

import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return; // avoid empty
    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

   const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
    setMessage("");
  }
  return (
    <div className="app-container">
      {/* Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">AI Chatbot</h1>
      </header>

      {/* Chatbox */}
      <div className="chatbox">
        <div className="messages">
          {messages.map((msg, i) => (
            <p
              key={i}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </p>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="chat-footer">
        <input
          className="chat-input"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="icon-button" onClick={sendMessage}>
          Send
        </button>
      </footer>
    </div>
  );
}

export default App;
