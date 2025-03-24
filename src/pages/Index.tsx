
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-warm-peach/50 px-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white overflow-hidden animate-scale-in">
        <div className="px-6 py-12 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            CareConnect
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            An elegant, emotionally-enhanced voice messaging app connecting elderly parents and their adult children.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
            <Link
              to="/elder"
              className="flex flex-col items-center p-8 rounded-2xl hover:shadow-lg transition-all hover:translate-y-[-4px] bg-warm-peach/70 hover:bg-warm-peach"
            >
              <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center bg-white/70 shadow-inner">
                <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Elder View</h2>
              <p className="text-center text-gray-600">Simple interface optimized for voice recording and message playback.</p>
            </Link>
            
            <Link
              to="/child"
              className="flex flex-col items-center p-8 rounded-2xl hover:shadow-lg transition-all hover:translate-y-[-4px] bg-warm-blue/70 hover:bg-warm-blue"
            >
              <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center bg-white/70 shadow-inner">
                <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Child View</h2>
              <p className="text-center text-gray-600">Text messaging interface with voice message playback.</p>
            </Link>
          </div>
          
          <div className="mt-16 text-sm text-gray-500">
            <p>
              Built with care, using modern web technologies.<br />
              Optimized for simplicity and emotional connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
