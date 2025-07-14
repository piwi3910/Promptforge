"use client";

import { TagSidebar } from "@/components/tags/tag-sidebar";
import { TaggedPromptsList } from "@/components/prompts/tagged-prompts-list";
import { ResizablePanels } from "@/components/ui/resizable-panels";
import { useState, useEffect, useCallback } from "react";
import { pageLayout } from "@/lib/styles";

interface SelectedTag {
  id: string | null;
  name: string;
}

export default function GroupByTagsPage() {
  const [selectedTag, setSelectedTag] = useState<SelectedTag>({
    id: null,
    name: "All Prompts"
  });

  // Load selected tag from localStorage on mount
  useEffect(() => {
    const savedTag = localStorage.getItem('selectedTag');
    if (savedTag) {
      try {
        const parsedTag = JSON.parse(savedTag);
        setSelectedTag(parsedTag);
      } catch (error) {
        console.error('Error parsing saved tag:', error);
      }
    }
  }, []);

  const handleTagSelect = useCallback((tagId: string | null, tagName: string) => {
    const newTag = {
      id: tagId,
      name: tagName
    };
    setSelectedTag(newTag);
    
    // Save selected tag to localStorage
    localStorage.setItem('selectedTag', JSON.stringify(newTag));
  }, []);

  return (
    <div className={pageLayout("h-full")}>
      <ResizablePanels
        leftPanel={<TagSidebar onSelectTag={handleTagSelect} selectedTag={selectedTag} />}
        rightPanel={
          <TaggedPromptsList
            selectedTagId={selectedTag.id}
            selectedTagName={selectedTag.name}
          />
        }
        defaultLeftWidth={250}
        minLeftWidth={200}
        maxLeftWidth={400}
      />
    </div>
  );
}