"use client";

import { FolderSidebar } from "@/components/folders/folder-sidebar";
import { PromptList } from "@/components/prompts/prompt-list";
import { ResizablePanels } from "@/components/ui/resizable-panels";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

interface SelectedFolder {
  id: string | null;
  name: string;
}

export default function Prompts() {
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder>({
    id: null,
    name: "Default"
  });
  const router = useRouter();

  // Load selected folder from localStorage on mount
  useEffect(() => {
    const savedFolder = localStorage.getItem('selectedFolder');
    if (savedFolder) {
      try {
        const parsedFolder = JSON.parse(savedFolder);
        setSelectedFolder(parsedFolder);
      } catch (error) {
        console.error('Error parsing saved folder:', error);
      }
    }
  }, []);

  const handleFolderSelect = useCallback((folderId: string, folderName: string) => {
    const newFolder = {
      id: folderId || null,
      name: folderName || "Default"
    };
    setSelectedFolder(newFolder);
    
    // Save selected folder to localStorage
    localStorage.setItem('selectedFolder', JSON.stringify(newFolder));
  }, []);

  return (
    <ResizablePanels
      leftPanel={<FolderSidebar onSelectFolder={handleFolderSelect} selectedFolder={selectedFolder} />}
      rightPanel={
        <div className="pb-4 px-4">
          <div className="flex justify-between items-center mb-4 -mt-2">
            <span className="font-medium">
              Selected folder: <span className="text-blue-500">{selectedFolder.name}</span>
            </span>
            <Button
              onClick={() => router.push(`/prompts/new?folderId=${selectedFolder.id || ''}`)}
              className="flex items-center gap-2"
            >
              <Icons.Plus className="h-4 w-4" />
              New Prompt
            </Button>
          </div>
          <PromptList folderId={selectedFolder.id || undefined} />
        </div>
      }
      defaultLeftWidth={210}
      minLeftWidth={150}
      maxLeftWidth={500}
    />
  );
}