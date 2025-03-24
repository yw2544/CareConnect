import { toast } from '@/hooks/use-toast';

// Environment variables would be loaded from .env file in a real app
// We're using dummy values for now
let OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "sk-eRVC0xVUP7JZTwEXrJFW8g";
let VOICE_API_KEY = import.meta.env.VITE_VOICE_API_KEY || "NhMIB6s0nyeL8SGSOu5n8SzYRq5x4CoB0M37akYwpj5OO6H2";

// Function to configure API keys
export const configureAPIKeys = (openAIKey: string, voiceAPIKey: string) => {
  OPENAI_API_KEY = openAIKey;
  VOICE_API_KEY = voiceAPIKey;
};

// Send text message to OpenAI for emotional enhancement
export const enhanceMessageWithLLM = async (message: string): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      // In demo mode, just simulate the enhancement
      console.log("Using demo enhancement (no API key)");
      return simulateEnhancement(message);
    }

    const response = await fetch("https://api.ai.it.cornell.edu/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai.gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a warm, empathetic assistant. Rewrite the following message from an adult child to their elderly parent. Your goal is to gently enhance the emotional tone while keeping the original meaning. The rewritten message must be in third-person voice, as if it is being read aloud on behalf of the child by a voice assistant. Do not use any first-person pronouns such as “I,” “me,” “my,” or “we.” Only return the rewritten message content, without any explanations, prefixes, or formatting. The tone should be calm, sincere, and affectionate, but not overly dramatic or artificial. You can start with, your child has just sent ..."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 10000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error enhancing message");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error enhancing message:", error);
    toast({
      title: "Fail in enhancement",
      description: "Use Original Message",
      variant: "destructive"
    });
    return message;
  }
};

// Generate voice from enhanced text
export const generateVoice = async (enhancedText: string): Promise<string> => {
  try {
    if (!VOICE_API_KEY) {
      // In demo mode, return a sample audio URL
      console.log("Using demo voice (no API key)");
      return "https://cdn.freesound.org/previews/701/701418_12648647-lq.mp3";
    }

    console.log("Generating voice for text:", enhancedText);
    
    const response = await fetch("https://api.hume.ai/v0/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hume-Api-Key": VOICE_API_KEY
      },
      body: JSON.stringify({
        utterances: [
          {
            text: enhancedText,
            description: "A warm, empathetic voice"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Voice API error:", errorData);
      throw new Error(errorData.error?.message || "Voice generation failed");
    }

    const data = await response.json();
    console.log("Voice API response:", data);
    
    // Handle the Hume.ai response format
    if (data.generations && data.generations.length > 0 && data.generations[0].audio) {
      // Get the base64 audio data
      const audioBase64 = data.generations[0].audio;
      
      console.log("Received base64 audio data, length:", audioBase64.length);
      
      // The base64 data might be missing the prefix, so add it if needed
      let base64WithPrefix = audioBase64;
      if (!audioBase64.startsWith('data:audio/mp3;base64,')) {
        base64WithPrefix = 'data:audio/mp3;base64,' + audioBase64;
      }
      
      // Create a new Audio element with the data URL
      const audio = new Audio(base64WithPrefix);
      
      // Test if the audio can be played
      try {
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
        console.log("Audio test successful");
      } catch (err) {
        console.warn("Audio test failed, trying alternative method:", err);
        
        // Alternative method: convert base64 to blob
        const byteCharacters = atob(audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });
        
        // Create URL from blob
        base64WithPrefix = URL.createObjectURL(audioBlob);
      }
      
      console.log("Final audio URL:", base64WithPrefix);
      return base64WithPrefix;
    } else {
      console.error("Invalid response format or missing audio data:", data);
      throw new Error("No audio data in response");
    }
  } catch (error) {
    console.error("Error generating voice:", error);
    toast({
      title: "Failed to generate voice",
      description: "Using sample audio instead",
      variant: "destructive"
    });
    return "https://cdn.freesound.org/previews/701/701418_12648647-lq.mp3";
  }
};

// Transcribe audio to text
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      // In demo mode, return a simulated transcript
      console.log("Using demo transcription (no API key)");
      return simulateTranscription();
    }

    // Convert audio blob to base64
    const buffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const response = await fetch("https://api.ai.it.cornell.edu/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai.whisper-1",
        file: base64Audio,
        language: "zh"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Transcription failed");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    toast({
      title: "Error transcribing audio",
      description: "Use Sample Instead",
      variant: "destructive"
    });
    return simulateTranscription();
  }
};

// Helper function to simulate enhancement for demo mode
const simulateEnhancement = (original: string): string => {
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

// Helper function to simulate transcription
const simulateTranscription = (): string => {
  const possibleTranscriptions = [
    ""
  ];
  
  return possibleTranscriptions[Math.floor(Math.random() * possibleTranscriptions.length)];
};
