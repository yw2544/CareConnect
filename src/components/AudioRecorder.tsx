
import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Mic } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  size = 'md',
  className = '' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const buttonSizeClass = size === 'sm' 
    ? 'w-16 h-16' 
    : size === 'lg' 
      ? 'w-32 h-32' 
      : 'w-24 h-24';
      
  const iconSizeClass = size === 'sm' 
    ? 'w-6 h-6' 
    : size === 'lg' 
      ? 'w-16 h-16' 
      : 'w-10 h-10';

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      stopMediaTracks();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = async () => {
    chunksRef.current = [];
    setRecordingDuration(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onRecordingComplete(audioBlob, audioUrl);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setRecordingDuration(0);
        stopMediaTracks();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setIsPermissionDenied(true);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${buttonSizeClass} rounded-full ${isRecording ? 'animate-pulse' : ''}`}>
        <button
          type="button"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={isPermissionDenied}
          className={`absolute inset-0 rounded-full bg-[#2B7AF0] text-white flex items-center justify-center shadow-lg transform transition-transform ${isRecording ? 'scale-110' : 'hover:scale-105'} active:scale-95`}
        >
          {isRecording && (
            <div className="record-pulse bg-[#2B7AF0]/70"></div>
          )}
          
          <Mic className={iconSizeClass} />
        </button>
      </div>
      
      {isRecording && (
        <div className="mt-2 flex items-center text-sm font-medium animate-pulse-slow">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          <span>{formatTime(recordingDuration)}</span>
        </div>
      )}
      
      {!isRecording && (
        <div className="mt-3 text-sm text-center text-gray-500">
          {size === 'lg' 
            ? 'Hold to record your message' 
            : 'Hold to record'}
        </div>
      )}
    </div>
  );
};
