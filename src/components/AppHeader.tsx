
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const isElderPage = location.pathname === "/elder";
  const isChildPage = location.pathname === "/child";
  const isSettingsPage = location.pathname === "/settings";

  return (
    <header className="fixed top-0 inset-x-0 glass z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight transform transition-transform hover:scale-105"
        >
          CareConnect
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link 
            to="/elder" 
            className={`px-4 py-2 rounded-full transition-all ${
              isElderPage 
                ? "bg-warm-peach text-gray-800 shadow-md" 
                : "text-gray-600 hover:bg-warm-peach/50"
            }`}
          >
            Elder View
          </Link>
          
          <Link 
            to="/child" 
            className={`px-4 py-2 rounded-full transition-all ${
              isChildPage 
                ? "bg-warm-blue text-gray-800 shadow-md" 
                : "text-gray-600 hover:bg-warm-blue/50"
            }`}
          >
            Child View
          </Link>
          
          <Link 
            to="/settings" 
            className={`p-2 rounded-full transition-all ${
              isSettingsPage 
                ? "bg-gray-200 text-gray-800 shadow-md" 
                : "text-gray-600 hover:bg-gray-200/50"
            }`}
            aria-label="Settings"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};
