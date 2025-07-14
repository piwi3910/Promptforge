'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Copy, 
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { stickyNoteCard } from '@/lib/styles';
import { togglePromptLike } from '@/app/actions/likes-comments.actions';
import { copySharedPrompt } from '@/app/actions/shared-prompts.actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SharedPromptCardProps {
  sharedPrompt: {
    id: string;
    promptId: string;
    title: string;
    description?: string | null;
    content: string;
    publishedAt: Date | null;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    copyCount: number;
    isLiked?: boolean;
    author: {
      id: string;
      username: string | null;
      name: string | null;
      avatarType: 'INITIALS' | 'GRAVATAR' | 'UPLOAD';
      profilePicture: string | null;
    };
    prompt: {
      tags: Array<{
        id: string;
        name: string;
      }>;
    };
  };
  onLikeToggle?: (id: string, isLiked: boolean) => void;
  onCopy?: (id: string) => void;
  showAuthor?: boolean;
  className?: string;
}

export function SharedPromptCard({ 
  sharedPrompt, 
  onLikeToggle, 
  onCopy,
  showAuthor = true 
}: SharedPromptCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isLiked, setIsLiked] = useState(sharedPrompt.isLiked || false);
  const [likeCount, setLikeCount] = useState(sharedPrompt.likeCount);

  // Generate consistent color based on prompt ID (same as existing prompts)
  const colors: Array<'yellow' | 'blue' | 'green' | 'pink' | 'orange'> = ['yellow', 'blue', 'green', 'pink', 'orange'];
  const colorIndex = sharedPrompt.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const stickyColor = colors[colorIndex];

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;

    setIsLiking(true);
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    try {
      const result = await togglePromptLike(sharedPrompt.promptId);
      if (result.success) {
        onLikeToggle?.(sharedPrompt.id, newIsLiked);
      } else {
        // Revert on error
        setIsLiked(isLiked);
        setLikeCount(likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCopying) return;

    setIsCopying(true);
    try {
      const result = await copySharedPrompt(sharedPrompt.id);
      if (result.success) {
        onCopy?.(sharedPrompt.id);
      }
    } catch (error) {
      console.error('Error copying prompt:', error);
    } finally {
      setIsCopying(false);
    }
  };

  const getDescriptionSnippet = (description: string | null | undefined) => {
    if (!description) return "Click to view this prompt...";
    const maxLength = 60;
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Link href={`/shared-prompts/${sharedPrompt.id}`}>
      <div className={stickyNoteCard(stickyColor, "group cursor-pointer")}>
        {/* Header with author info */}
        {showAuthor && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar 
                user={{
                  id: sharedPrompt.author.id,
                  username: sharedPrompt.author.username,
                  name: sharedPrompt.author.name,
                  avatarType: sharedPrompt.author.avatarType,
                  profilePicture: sharedPrompt.author.profilePicture
                }} 
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {sharedPrompt.author.name || sharedPrompt.author.username}
                </p>
                {sharedPrompt.publishedAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(sharedPrompt.publishedAt)}
                  </div>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopy} disabled={isCopying}>
                  <Copy className="w-4 h-4 mr-2" />
                  {isCopying ? 'Copying...' : 'Copy to My Library'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Title */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-dell-blue-600 transition-colors">
            {sharedPrompt.title}
          </h3>
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 line-clamp-3">
            {getDescriptionSnippet(sharedPrompt.description)}
          </p>
        </div>

        {/* Tags */}
        {sharedPrompt.prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {sharedPrompt.prompt.tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag.id} 
                variant="secondary" 
                className="text-xs px-1.5 py-0.5 bg-white/50 text-gray-600 hover:bg-white/70"
              >
                {tag.name}
              </Badge>
            ))}
            {sharedPrompt.prompt.tags.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs px-1.5 py-0.5 bg-white/50 text-gray-600"
              >
                +{sharedPrompt.prompt.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {sharedPrompt.viewCount}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {sharedPrompt.commentCount}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`h-6 w-6 p-0 transition-all ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-xs text-gray-500 min-w-[1rem] text-center">
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}