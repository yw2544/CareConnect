// This file simulates backend API calls in the frontend for demo purposes
// In a real application, these would connect to actual backend endpoints

export interface Message {
  id: string;
  content: string;
  audioUrl?: string;
  sender: 'elder' | 'child';
  enhanced?: boolean;
  timestamp: string;
  isProcessing?: boolean;
}

// Simulated message store
let messages: Message[] = [
  {
    id: "1",
    content: "Hello Mom! Just checking in to see how you're doing today.",
    sender: "child",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "2",
    content: "I'm doing well, sweetheart. Just finished tending to my garden. The roses are blooming beautifully this year.",
    audioUrl: "https://cdn.freesound.org/previews/701/701418_12648647-lq.mp3", // Sample audio
    sender: "elder",
    timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
  },
  {
    id: "3",
    content: "That's wonderful! I'd love to see them when I visit next weekend. Have you been using the new gardening tools I got you?",
    sender: "child",
    timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
  {
    id: "4",
    content: "Yes, they've been very helpful. The new gloves fit perfectly and protect my hands. Thank you for thinking of me.",
    audioUrl: "https://cdn.freesound.org/previews/701/701419_12648647-lq.mp3", // Sample audio
    sender: "elder",
    timestamp: new Date(Date.now() - 36000000).toISOString(), // 10 hours ago
  },
];

// Get all messages
export const getMessages = async (): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...messages];
};

// Send a text message from child
export const sendChildMessage = async (content: string): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create new message
  const message: Message = {
    id: Date.now().toString(),
    content,
    sender: "child",
    timestamp: new Date().toISOString()
  };
  
  messages = [...messages, message];
  
  // Simulate enhanced message with voice response (in a real app, this would come from the backend)
  setTimeout(() => {
    const enhancedContent = enhanceMessage(content);
    const audioUrl = "https://cdn.freesound.org/previews/701/701417_12648647-lq.mp3"; // Sample audio
    
    const enhancedMessage: Message = {
      id: Date.now().toString(),
      content: enhancedContent,
      audioUrl,
      sender: "elder",
      enhanced: true,
      timestamp: new Date().toISOString()
    };
    
    messages = [...messages, enhancedMessage];
  }, 3000);
  
  return message;
};

// Send an audio message from elder
export const sendElderAudio = async (audioBlob: Blob): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create audio URL
  const audioUrl = URL.createObjectURL(audioBlob);
  
  // Simulate transcribing the audio (in a real app, this would be done on the backend)
  const transcribedContent = await simulateTranscription();
  
  const message: Message = {
    id: Date.now().toString(),
    content: transcribedContent,
    audioUrl,
    sender: "elder",
    timestamp: new Date().toISOString()
  };
  
  messages = [...messages, message];
  return message;
};

// Simulate enhancing a message
const enhanceMessage = (original: string): string => {
  // This would be done by an LLM in a real application
  const enhancementPatterns = [
    { pattern: /checking in/i, replacement: "thinking of you and wanted to check in" },
    { pattern: /how are you/i, replacement: "how are you feeling today, my dear" },
    { pattern: /miss you/i, replacement: "miss you terribly" },
    { pattern: /visit/i, replacement: "come see you" },
    { pattern: /talk/i, replacement: "have a lovely chat" },
  ];
  
  let enhanced = original;
  
  enhancementPatterns.forEach(({ pattern, replacement }) => {
    enhanced = enhanced.replace(pattern, replacement);
  });
  
  // Add warm closing if not present
  if (!enhanced.includes("love you")) {
    enhanced += " Love you!";
  }
  
  return enhanced;
};

// Simulate transcription
const simulateTranscription = async (): Promise<string> => {
  // Simulate transcription delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const possibleTranscriptions = [
    "I had a wonderful day today. The weather was beautiful and I went for a short walk in the garden.",
    "Thank you for calling yesterday. It was so nice to hear your voice. How are the children doing?",
    "I tried that recipe you sent me. It turned out delicious! I'll make it again when you visit.",
    "The neighbors brought over some fresh vegetables from their garden. So thoughtful of them.",
    "I've been reading that book you recommended. It's very interesting so far."
  ];
  
  return possibleTranscriptions[Math.floor(Math.random() * possibleTranscriptions.length)];
};


export const clearMessages = async (): Promise<void> => {
  try {
    
    console.log('clear all messages');
    
  } catch (error) {
    console.error('Fail to clear messages:', error);
    throw error;
  }
};
