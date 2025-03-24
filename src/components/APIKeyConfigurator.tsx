
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { configureAPIKeys } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

export const APIKeyConfigurator: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [voiceAPIKey, setVoiceAPIKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleSaveKeys = () => {
    setIsConfiguring(true);
    try {
      configureAPIKeys(openAIKey, voiceAPIKey);
      localStorage.setItem('careconnect_openai_key', openAIKey);
      localStorage.setItem('careconnect_voice_key', voiceAPIKey);
      
      toast({
        title: "API 密钥已保存",
        description: "您的 API 密钥已保存，将用于未来的请求。",
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "错误",
        description: "保存 API 密钥失败。请重试。",
        variant: "destructive"
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  // Load saved keys from localStorage on component mount
  React.useEffect(() => {
    const savedOpenAIKey = localStorage.getItem('careconnect_openai_key');
    const savedVoiceAPIKey = localStorage.getItem('careconnect_voice_key');
    
    if (savedOpenAIKey) setOpenAIKey(savedOpenAIKey);
    if (savedVoiceAPIKey) setVoiceAPIKey(savedVoiceAPIKey);
    
    // Configure API service with saved keys
    if (savedOpenAIKey || savedVoiceAPIKey) {
      configureAPIKeys(
        savedOpenAIKey || '',
        savedVoiceAPIKey || ''
      );
    }
  }, []);

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">API Configuration</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="openai-key" className="text-sm font-medium mb-1 block">
            OpenAI API key 
          </label>
          <Input
            id="openai-key"
            type="password"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
            placeholder="sk-..."
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Default: sk-eRVC0xVUP7JZTwEXrJFW8g
          </p>
        </div>
        
        <div>
          <label htmlFor="voice-key" className="text-sm font-medium mb-1 block">
            Voice API key (Hume.ai)
          </label>
          <Input
            id="voice-key"
            type="password"
            value={voiceAPIKey}
            onChange={(e) => setVoiceAPIKey(e.target.value)}
            placeholder="Your voice API key"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Default: NhMIB6s0nyeL8SGSOu5n8SzYRq5x4CoB0M37akYwpj5OO6H2
          </p>
        </div>
        
        <Button 
          onClick={handleSaveKeys}
          disabled={isConfiguring}
          className="w-full"
        >
          {isConfiguring ? 'Saving...' : 'Saving API keys'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          Youe API key will be stored locally.
        </p>
      </div>
    </div>
  );
};
