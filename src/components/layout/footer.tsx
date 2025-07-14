import React from 'react';
import { Heart, Globe, Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-dell-blue-500 to-dell-blue-600 text-white py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright and branding */}
          <div className="flex items-center gap-2 text-sm">
            <p className="flex items-center gap-1">
              © {currentYear} Pascal Watteel. Made with
              <Heart className="h-3 w-3 text-red-300 animate-pulse" fill="currentColor" />
              for the AI community
            </p>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
              <span>All systems operational</span>
            </div>
            
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
              <Globe className="h-3 w-3" />
              <span>Global CDN</span>
            </div>
            
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
              <Shield className="h-3 w-3" />
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
        
        {/* Subtle gradient line */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Additional info */}
        <div className="mt-3 text-center">
          <p className="text-xs opacity-75">
            Powered by Dell Technologies Design System
          </p>
        </div>
      </div>
    </footer>
  );
}