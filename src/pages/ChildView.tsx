import React, { useEffect, useRef } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { AudioPlayer } from '@/components/AudioPlayer';
import { TranscriptBubble } from '@/components/TranscriptBubble';
import { useMessages } from '@/context/MessageContext';
import { Card, CardContent } from '@/components/ui/card';

const ChildView = () => {
  const { messages, loading, sending, sendTextMessage } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    sendTextMessage(content);
  };

  return (
    <div className="min-h-screen pt-20 pb-6 px-4 sm:px-6 bg-gradient-to-b from-white to-warm-blue/20">
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Family Chat</h1>
          <p className="text-gray-600">Connect with your loved ones through heartfelt messages</p>
        </div>

        {/* Messages container */}
        <Card className="flex-1 shadow-sm border-0 mb-4 overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="h-full overflow-y-auto px-4 py-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-warm-blue/50 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 max-w-sm">
                    No messages yet. Start a conversation with your loved one.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages
                    .filter((message) => !(message.sender === 'child' && message.enhanced))
                    .map((message) => (
                    <div key={message.id} className="mb-8">
                      <TranscriptBubble
                        message={message.content}
                        sender={message.sender}
                        timestamp={message.timestamp}
                      />
                      
                      {message.audioUrl && message.sender === 'elder' && (
                        <div className="ml-4 -mt-2 mb-2">
                          <AudioPlayer src={message.audioUrl} className="max-w-[280px]" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message input */}
        <div className="mt-auto">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            placeholder="Type a message to your loved one..."
            className={sending ? 'opacity-70 pointer-events-none' : ''}
          />
          
          {sending && (
            <div className="text-center text-sm text-gray-500 mt-2 animate-pulse">
              Sending your message...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildView;
