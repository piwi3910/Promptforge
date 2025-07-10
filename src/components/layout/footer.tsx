import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-orange-500 text-white py-2 px-6 mt-auto">
      <div className="flex justify-center items-center text-sm">
        <p>© {currentYear} Pascal Watteel. All rights reserved.</p>
      </div>
    </footer>
  );
}