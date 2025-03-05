import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [enhancement, setEnhancement] = useState("emotion");

  const handleSend = () => {
    if (message.trim() === "") return;
    onSend({ content: message, enhancement });
    setMessage("");
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 md:p-8 transform transition-all hover:shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Send Message</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write down what you want to say..."
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200 mb-6 shadow-inner"
      />
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-inner">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Enhancement Options</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="enhancement"
              value="emotion"
              checked={enhancement === "emotion"}
              onChange={() => setEnhancement("emotion")}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium">Emotion Enhancement</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="enhancement"
              value="multimedia"
              checked={enhancement === "multimedia"}
              onChange={() => setEnhancement("multimedia")}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium">Multimedia Enhancement</span>
          </label>
        </div>
      </div>
      
      <button
        onClick={handleSend}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-1 shadow-lg"
      >
        Send Message
      </button>
    </div>
  );
};

export default MessageInput;
