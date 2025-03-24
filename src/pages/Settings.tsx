
import React from 'react';
import { APIKeyConfigurator } from '@/components/APIKeyConfigurator';

const Settings = () => {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-gradient-to-b from-white to-warm-blue/20">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <APIKeyConfigurator />
          
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-4">About CareConnect</h3>
            <p className="text-gray-600">
              CareConnect is an emotionally-enhanced voice messaging app designed to bridge the gap between elderly parents and their adult children.
            </p>
            <p className="text-gray-600 mt-2">
              Our app uses AI to enhance messages, making communication more warm and personal. Voice messages are transcribed for accessibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
