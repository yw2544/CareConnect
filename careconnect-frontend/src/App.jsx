import ChatWindow from "./components/ChatWindow";

function App() {
  const handleSendMessage = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/process_message/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sender: "child", 
          content: data.content, 
          enhancement: data.enhancement 
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const responseData = await response.json();
      return responseData.processed_content;
      
    } catch (error) {
      console.error("Error sending message:", error);
      return "Error processing message";
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
      <ChatWindow onSend={handleSendMessage} />
    </div>
  );
}

export default App;
