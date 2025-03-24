
import React from 'react';

interface TranscriptBubbleProps {
  message: string;
  sender: 'elder' | 'child';
  timestamp: Date | string;
}

export const TranscriptBubble: React.FC<TranscriptBubbleProps> = ({ 
  message, 
  sender,
  timestamp 
}) => {
  const formattedTime = typeof timestamp === 'string' 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
  return (
    <div 
      className={`mb-4 ${sender === 'child' ? 'text-right' : 'text-left'}`}
    >
      <div className="inline-block text-left">
        <div 
          className={`
            ${sender === 'child' ? 'message-sent animate-fade-in' : 'message-received animate-fade-in'} 
            shadow-sm
          `}
        >
          {message}
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${sender === 'child' ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
