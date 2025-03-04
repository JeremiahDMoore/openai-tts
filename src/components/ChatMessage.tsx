import React, { useState } from 'react';
import { Message } from '../types';
import { Play, Pause } from 'lucide-react';
import { generateSpeech } from '../services/openai';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleGenerateSpeech = async () => {
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
      return;
    }

    setIsLoading(true);
    try {
      const url = await generateSpeech(message.content);
      setAudioUrl(url);
      setIsPlaying(true);
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Failed to generate speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-lg ${
        isAssistant
          ? 'bg-[#ede9fe] text-[#4c1d95]'
          : 'bg-accent text-white'
      }`}>
        <div className="flex items-start gap-2">
          {isAssistant && (
            <button
              onClick={handleGenerateSpeech}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-300 transition-colors"
              aria-label={isPlaying ? "Pause speech" : "Play speech"}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </button>
          )}
          <div className="prose prose-sm">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;