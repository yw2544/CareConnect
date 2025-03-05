import { useState } from "react";
import "../index.css"; // 确保 CSS 被正确引入

const ChatWindow = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    const newMessages = [...messages, { sender: "child", content: message }];
    setMessages(newMessages);

    const response = await onSend({ content: message });

    setMessages([...newMessages, { sender: "llm", content: response }]);

    setMessage("");
  };

  return (
    <div className="chat-container">
      {/* 侧边栏：在小屏幕隐藏 */}
      <div className="sidebar hidden md:flex">
        <h2>Chat History</h2>
        <div className="chat-history">
          <div className="chat-history-item">Previous Chat 1</div>
          <div className="chat-history-item">Previous Chat 2</div>
        </div>
      </div>

      {/* 主聊天窗口，支持响应式 */}
      <div className="chat-main w-full md:w-3/4">
        <h2>CareConnect Chat</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.sender === "child" ? "chat-child" : "chat-llm"}`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
          />
          <button onClick={handleSend}>Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;


