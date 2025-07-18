"use client";

import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters';
import { SharedPromptCard } from '@/components/marketplace/shared-prompt-card';
import { ResizablePanels } from '@/components/ui/resizable-panels';
import { useState, useEffect } from 'react';
import { getSharedPrompts } from '@/app/actions/shared-prompts.actions';
import { initializeMarketplace } from '@/app/actions/shared-prompts.actions';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  RefreshCw,
  Share2
} from 'lucide-react';

interface SharedPrompt {
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
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function SharedPromptsPage() {
  const [prompts, setPrompts] = useState<SharedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'liked' | 'copied'>('recent');
  const [availableTags, setAvailableTags] = useState<Array<{ id: string; name: string; count: number }>>([]);

  // Initialize marketplace on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeMarketplace();
      } catch (error) {
        console.error('Error initializing marketplace:', error);
      }
    };
    initialize();
  }, []);

  // Load prompts
  const loadPrompts = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const result = await getSharedPrompts({
        page,
        limit: 12,
        search: searchQuery,
        tags: selectedTags,
        sortBy
      });

      if (result.success && result.prompts && result.pagination) {
        if (append) {
          setPrompts(prev => [...prev, ...result.prompts]);
        } else {
          setPrompts(result.prompts);
        }
        setPagination(result.pagination);
        setError(null);
      } else {
        setError(result.error || 'Failed to load prompts');
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
      setError('Failed to load prompts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more prompts for pagination
  const loadMore = () => {
    if (pagination?.hasNext && !loadingMore) {
      loadPrompts(pagination.page + 1, true);
    }
  };

  // Filter change handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSortChange = (sort: 'recent' | 'popular' | 'liked' | 'copied') => {
    setSortBy(sort);
  };

  // Load prompts when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPrompts(1, false);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags, sortBy]);

  // Initial load
  useEffect(() => {
    loadPrompts();
    
    // Mock available tags for now - in real app this would come from API
    setAvailableTags([
      { id: '1', name: 'AI Writing', count: 45 },
      { id: '2', name: 'Code Generation', count: 32 },
      { id: '3', name: 'Creative', count: 28 },
      { id: '4', name: 'Business', count: 23 },
      { id: '5', name: 'Marketing', count: 19 },
      { id: '6', name: 'Education', count: 15 },
    ]);
  }, []);

  const handleLikeToggle = (promptId: string, isLiked: boolean) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { 
            ...prompt, 
            isLiked, 
            likeCount: prompt.likeCount + (isLiked ? 1 : -1) 
          }
        : prompt
    ));
  };

  const handleCopy = (promptId: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, copyCount: prompt.copyCount + 1 }
        : prompt
    ));
  };

  const renderFilterSidebar = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-[#007DB8]" />
        <h2 className="text-lg font-semibold">Find Prompts</h2>
      </div>
      
      <MarketplaceFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        availableTags={availableTags}
      />
    </div>
  );

  const renderMainContent = () => {
    if (loading && prompts.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#007DB8]" />
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-destructive mb-4">
            <p>{error}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => loadPrompts()} 
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    if (prompts.length === 0) {
      return (
        <div className="text-center py-12">
          <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No prompts found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedTags.length > 0 
              ? 'Try adjusting your search or filters'
              : 'Be the first to share a prompt with the community!'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shared Prompts</h1>
            <p className="text-muted-foreground">
              Discover and share amazing prompts with the community
            </p>
          </div>
          {pagination && (
            <div className="text-sm text-muted-foreground">
              {pagination.total} prompts
            </div>
          )}
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-12">
          {prompts.map((prompt) => (
            <SharedPromptCard
              key={prompt.id}
              sharedPrompt={prompt}
              onLikeToggle={handleLikeToggle}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* Load More */}
        {pagination?.hasNext && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load More (${pagination.total - prompts.length} remaining)`
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <ResizablePanels
      leftPanel={renderFilterSidebar()}
      rightPanel={
        <div className="pb-4 px-4">
          {renderMainContent()}
        </div>
      }
      defaultLeftWidth={210}
      minLeftWidth={150}
      maxLeftWidth={500}
    />
  );
}