import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-orange-500 text-white py-4 px-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="text-center md:text-left">
          <p>© {currentYear} Pascal Watteel. All rights reserved.</p>
        </div>
        <div className="text-center md:text-right mt-2 md:mt-0">
          <p>Built with Next.js & TypeScript</p>
        </div>
      </div>
    </footer>
  );
}