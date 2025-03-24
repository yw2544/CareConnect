import React, { useState, useEffect, useRef } from 'react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { AudioPlayer, AudioPlayerHandle } from '@/components/AudioPlayer';
import { useMessages } from '@/context/MessageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Play, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ElderView = () => {
  const { messages, loading, sending, sendAudioMessage } = useMessages();
  const [latestChildMessage, setLatestChildMessage] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const audioPlayerRefs = useRef<Record<string, AudioPlayerHandle>>({});

  // Find the latest message from child
  useEffect(() => {
    if (messages.length > 0) {
      const childMessages = messages.filter(msg => msg.sender === 'child');
      if (childMessages.length > 0) {
        setLatestChildMessage(childMessages[childMessages.length - 1]);
      }
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle recording completion
  const handleRecordingComplete = (audioBlob: Blob, audioUrl: string) => {
    sendAudioMessage(audioBlob);
    setShowRecorder(false);
  };

  // Format date for blog-like display
  const formatMessageDate = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Group child messages for blog-like display
  const childMessages = messages.filter(msg => msg.sender === 'child');

  // Find enhanced response (elder message that follows child message)
  const findEnhancedResponse = (childMessageId: string) => {
    const childIndex = messages.findIndex(msg => msg.id === childMessageId);
    if (childIndex !== -1 && childIndex + 1 < messages.length) {
      const nextMessage = messages[childIndex + 1];
      if (nextMessage.sender === 'elder' && nextMessage.enhanced) {
        return nextMessage;
      }
    }
    return null;
  };

  // Play audio for a specific message
  const playAudio = (messageId: string, audioUrl: string) => {
    console.log("Attempting to play audio for message:", messageId);
    console.log("Audio URL:", audioUrl);
    
    // Try using the ref first
    const playerRef = audioPlayerRefs.current[messageId];
    if (playerRef) {
      console.log("Using player ref to play audio");
      playerRef.play();
    } else {
      console.log("Player ref not found, creating new audio element");
      // Fallback to creating a new audio element
      const audio = new Audio(audioUrl);
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        toast({
          title: "Audio playback failed",
          description: "Unable to play this audio. Please check the console for details.",
          variant: "destructive"
        });
      };
      
      audio.play().catch(err => {
        console.error("Failed to play audio:", err);
        toast({
          title: "Audio playback failed",
          description: err.message,
          variant: "destructive"
        });
      });
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-warm-peach/20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">CareConnect</h1>
          <p className="text-gray-600">Stay connected with your loved ones</p>
        </div>

        <Tabs defaultValue="latest" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="latest">Latest Message</TabsTrigger>
            <TabsTrigger value="history">Previous Messages</TabsTrigger>
          </TabsList>
          
          {/* Latest message tab */}
          <TabsContent value="latest" className="focus-visible:outline-none focus-visible:ring-0">
            {latestChildMessage ? (
              <Card className="shadow-md border-0 overflow-hidden animate-fade-in">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">
                      {formatMessageDate(latestChildMessage.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 mt-1">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary"
                        onClick={() => {
                          playAudio(latestChildMessage.id, latestChildMessage.audioUrl || '');
                        }}
                      >
                        <Play className="h-4 w-4" />
                        <span className="sr-only">Play message</span>
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl leading-relaxed text-gray-800">
                        {latestChildMessage.content}
                      </p>
                      
                      {/* Enhanced response (if available) */}
                      {findEnhancedResponse(latestChildMessage.id) && (
                        <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Enhanced response:</h4>
                          <p className="text-gray-800">
                            {findEnhancedResponse(latestChildMessage.id)?.content}
                          </p>
                          {findEnhancedResponse(latestChildMessage.id)?.audioUrl && (
                            <div className="mt-3">
                              <AudioPlayer 
                                ref={(el) => {
                                  if (el) audioPlayerRefs.current[latestChildMessage.id] = el;
                                }}
                                src={findEnhancedResponse(latestChildMessage.id)?.audioUrl || ''}
                                className="max-w-md"
                                id={`enhanced-audio-${findEnhancedResponse(latestChildMessage.id)?.id}`}
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => playAudio(latestChildMessage.id, findEnhancedResponse(latestChildMessage.id)?.audioUrl || '')}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Play Enhanced Message
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    {showRecorder ? (
                      <div className="bg-warm-blue/10 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Record Your Response</h3>
                        <div className="flex justify-center py-6">
                          <AudioRecorder
                            onRecordingComplete={handleRecordingComplete}
                            size="lg"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => setShowRecorder(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full py-6 text-lg"
                        onClick={() => setShowRecorder(true)}
                      >
                        <Mic className="mr-2 h-5 w-5" />
                        Record a Response
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-warm-blue/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No messages yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Once your family sends you a message, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Message history tab */}
          <TabsContent value="history" className="focus-visible:outline-none focus-visible:ring-0">
            {childMessages.length > 1 ? (
              <div className="space-y-6">
                {childMessages.slice(0, -1).reverse().map((message) => (
                  <Card key={message.id} className="shadow-sm border-0 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">
                          {formatMessageDate(message.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary"
                            onClick={() => {
                              playAudio(message.id, message.audioUrl || '');
                            }}
                          >
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Play message</span>
                          </Button>
                        </div>
                        <div className="flex-1">
                          <p className="text-lg leading-relaxed text-gray-800">
                            {message.content}
                          </p>
                          
                          {/* Enhanced response (if available) */}
                          {findEnhancedResponse(message.id) && (
                            <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Enhanced response:</h4>
                              <p className="text-gray-800">
                                {findEnhancedResponse(message.id)?.content}
                              </p>
                              {findEnhancedResponse(message.id)?.audioUrl && (
                                <div className="mt-3">
                                  <AudioPlayer 
                                    ref={(el) => {
                                      if (el) audioPlayerRefs.current[message.id] = el;
                                    }}
                                    src={findEnhancedResponse(message.id)?.audioUrl || ''} 
                                    className="max-w-md"
                                    id={`enhanced-audio-${findEnhancedResponse(message.id)?.id}`}
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => playAudio(message.id, findEnhancedResponse(message.id)?.audioUrl || '')}
                                  >
                                    <Play className="w-4 h-4 mr-1" />
                                    Play Enhanced Message
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No previous messages to display.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Reply section for mobile view */}
        <div className="fixed bottom-6 right-6 z-10 md:hidden">
          <div className="bg-white rounded-full shadow-lg p-4">
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full" 
              onClick={() => setShowRecorder(true)}
            >
              <Mic className="h-7 w-7" />
              <span className="sr-only">Record message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderView;
