import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, getMessages, sendChildMessage, sendElderAudio, clearMessages } from '../services/api';
import { enhanceMessageWithLLM, generateVoice, transcribeAudio } from '../services/apiService';
import { toast } from '@/hooks/use-toast';

interface MessageContextType {
  messages: Message[];
  loading: boolean;
  sending: boolean;
  sendTextMessage: (content: string) => Promise<void>;
  sendAudioMessage: (audioBlob: Blob) => Promise<void>;
  clearAllMessages: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Send a text message from the child
  const sendTextMessage = async (content: string) => {
    try {
      setSending(true);
      
      // First, send the original message
      const newMessage = await sendChildMessage(content);
      setMessages(prev => [...prev, newMessage]);
      
      // Next, enhance the message with LLM
      const enhancedContent = await enhanceMessageWithLLM(content);
      
      // Generate voice from enhanced text
      const audioUrl = await generateVoice(enhancedContent);
      
      // Create enhanced message with audio
      const enhancedMessage: Message = {
        id: Date.now().toString(),
        content: enhancedContent,
        audioUrl,
        sender: "child",
        enhanced: true,
        timestamp: new Date().toISOString()
      };
      
      // Add enhanced message to state
      setMessages(prev => [...prev, enhancedMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // Send an audio message from the elder
  const sendAudioMessage = async (audioBlob: Blob) => {
    try {
      setSending(true);
      
      // Transcribe the audio
      const transcribedContent = await transcribeAudio(audioBlob);
      
      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create new message with transcription and audio
      const newMessage: Message = {
        id: Date.now().toString(),
        content: transcribedContent,
        audioUrl,
        sender: "elder",
        timestamp: new Date().toISOString()
      };
      
      // Update message state
      setMessages(prev => [...prev, newMessage]);
      
      toast({
        title: "Message sent",
        description: "Your voice message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending audio:', error);
      toast({
        title: "Error",
        description: "Failed to send audio message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // Clear all messages
  const clearAllMessages = async () => {
    try {
      setLoading(true);
      await clearMessages();
      setMessages([]);
      toast({
        title: "消息已清空",
        description: "所有聊天记录已被删除",
      });
    } catch (error) {
      console.error("清空消息失败:", error);
      toast({
        title: "清空消息失败",
        description: "无法删除聊天记录",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        sending,
        sendTextMessage,
        sendAudioMessage,
        clearAllMessages
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
