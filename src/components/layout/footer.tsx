import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-dell-blue-500 to-dell-blue-600 py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          {/* Copyright only */}
          <div className="text-sm">
            <p className="text-white">
              © {currentYear} Pascal Watteel
            </p>
          </div>
        </div>
        
        {/* Subtle gradient line */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Additional info */}
        <div className="mt-3 text-center">
          <p className="text-xs opacity-75 text-white">
            Powered by Dell Technologies Design System
          </p>
        </div>
      </div>
    </footer>
  );
}