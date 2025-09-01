import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋! Ask me about products, stock, or help." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post("http://localhost:4000/api/ai/chat", {
        message: input,
      });

      setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Sorry, something went wrong!" },
      ]);
    }

    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#ff4d6d",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          <FaRobot size={28} color="white" />
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width: "320px",
            height: "420px",
            background: "#fff",
            borderRadius: "15px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#ff4d6d",
              color: "#fff",
              padding: "12px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#f9f9f9",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    background: msg.from === "user" ? "#ff4d6d" : "#e6e6e6",
                    color: msg.from === "user" ? "white" : "black",
                    maxWidth: "80%",
                  }}
                >
                  {msg.from === "bot" ? (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => {
                          if (href.startsWith("/product/") || href.startsWith("/category/") || href.startsWith("/brand/")) {
                            return (
                              <Link to={href} className="text-blue-600 underline">
                                {children}
                              </Link>
                            );
                          }
                          return (
                            <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "none",
                padding: "10px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <IoMdSend size={20} color="#6bffb5ff" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
