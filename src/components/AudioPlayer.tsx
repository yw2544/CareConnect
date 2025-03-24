import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { toast } from '@/hooks/use-toast';

export interface AudioPlayerHandle {
  play: () => void;
}

interface AudioPlayerProps {
  src: string;
  className?: string;
  id?: string;
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ src, className, id }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Expose play method to parent via ref
    useImperativeHandle(ref, () => ({
      play: () => {
        const audio = audioRef.current;
        if (audio) {
          if (!isLoaded) {
            console.log("Audio not loaded yet, loading first...");
            audio.load();
            audio.oncanplaythrough = () => {
              console.log("Now can play through after load");
              audio.play().catch(err => {
                console.error("Play failed after load:", err);
                toast({
                  title: "Audio playback failed",
                  description: "Unable to play this audio",
                  variant: "destructive"
                });
              });
              setIsPlaying(true);
            };
          } else {
            console.log("Audio already loaded, playing directly");
            audio.play().catch(err => {
              console.error("Direct play failed:", err);
              toast({
                title: "Audio playback failed",
                description: "Unable to play this audio",
                variant: "destructive"
              });
            });
            setIsPlaying(true);
          }
        }
      }
    }));

    // Load audio when src changes
    useEffect(() => {
      setIsLoaded(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      const audio = audioRef.current;
      if (!audio) return;
      
      console.log("Loading audio from src:", src);
      audio.load();
    }, [src]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleLoadedMetadata = () => {
        console.log("Audio metadata loaded, duration:", audio.duration);
        setDuration(audio.duration);
        setIsLoaded(true);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleCanPlayThrough = () => {
        console.log("Audio can play through");
        setIsLoaded(true);
      };

      const handleError = (e: Event) => {
        console.error("Audio playback error:", e);
        setIsLoaded(false);
        toast({
          title: "Audio playback failed",
          description: "Unable to play this audio",
          variant: "destructive"
        });
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }, []);

    const togglePlayPause = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        if (!isLoaded) {
          console.log("Loading audio before playing...");
          audio.load();
          audio.oncanplaythrough = () => {
            audio.play().catch(err => console.error("Play failed:", err));
            setIsPlaying(true);
          };
        } else {
          audio.play().catch(err => {
            console.error("Play failed:", err);
            toast({
              title: "Audio playback failed",
              description: "Unable to play this audio",
              variant: "destructive"
            });
          });
          setIsPlaying(true);
        }
      }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;

      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
      <div className={`flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100 ${className}`}>
        <audio ref={audioRef} src={src} preload="metadata" id={id} />
        
        <button
          onClick={togglePlayPause}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white transform transition-transform hover:scale-105 active:scale-95"
          disabled={!src}
        >
          <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          {isPlaying ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3l14 9-14 9V3z"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSliderChange}
            className="audio-slider"
            disabled={!isLoaded}
          />
        </div>

        <div className="text-xs font-medium text-gray-600 w-14 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';
