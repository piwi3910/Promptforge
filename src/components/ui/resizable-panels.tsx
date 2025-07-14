"use client";

import React, { useState, useRef, useCallback, ReactNode } from "react";

interface ResizablePanelsProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 210,
  minLeftWidth = 150,
  maxLeftWidth = 500,
  className = ""
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Constrain the width within min/max bounds
    const constrainedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth));
    setLeftWidth(constrainedWidth);
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className={`flex h-full ${className}`}>
      {/* Left Panel */}
      <div 
        style={{ width: `${leftWidth}px` }}
        className="flex-shrink-0 overflow-hidden"
      >
        {leftPanel}
      </div>
      
      {/* Resizer */}
      <div
        className={`w-1 bg-border hover:bg-dell-blue-500 cursor-col-resize transition-colors flex-shrink-0 ${
          isDragging ? 'bg-dell-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full" />
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 overflow-hidden">
        {rightPanel}
      </div>
    </div>
  );
}