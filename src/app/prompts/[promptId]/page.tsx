"use client";

import { useEffect, useState } from "react";
import { getPromptById } from "@/app/actions/prompt.actions.cached";
import { updatePrompt, createPrompt } from "@/app/actions/prompt.actions";
import { Editor } from "@/components/editor/editor";
import type { Prompt, Tag, PromptVersion } from "@/generated/prisma";
import { useDebounce } from "@/hooks/use-debounce";
import { VersionHistorySidebar } from "@/components/prompts/version-history-sidebar";
import { EnhancedTagInput } from "@/components/prompts/enhanced-tag-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Save, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

export default function PromptPage({
  params,
}: {
  params: Promise<{ promptId: string }>;
}) {
  const [prompt, setPrompt] = useState<(Prompt & { tags: Tag[], versions: PromptVersion[] }) | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptId, setPromptId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("Text");
  const [tags, setTags] = useState<string[]>([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const debouncedContent = useDebounce(content, 500);
  const debouncedDescription = useDebounce(description, 500);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onOpen } = useModal();

  const languageOptions = ["Markdown", "Text", "JavaScript", "Python", "JSON", "YAML", "XML"];

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.promptId;
      setPromptId(id);
      setIsCreateMode(id === "new");
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!promptId) return;
    
    if (isCreateMode) {
      // Initialize empty state for new prompt
      setPrompt(null);
      setContent("");
      setTitle("");
      setDescription("");
      setTags([]);
      return;
    }
    
    const fetchPrompt = async () => {
      const fetchedPrompt = await getPromptById(promptId);
      setPrompt(fetchedPrompt as (Prompt & { tags: Tag[], versions: PromptVersion[] }) | null);
      setContent(fetchedPrompt?.content || "");
      setTitle(fetchedPrompt?.title || "");
      setDescription(fetchedPrompt?.description || "");
      setTags(fetchedPrompt?.tags?.map(tag => tag.name) || []);
    };
    fetchPrompt();
  }, [promptId, isCreateMode]);

  useEffect(() => {
    if (!promptId || isCreateMode || debouncedContent === prompt?.content) return;
    
    updatePrompt(promptId, { content: debouncedContent });
  }, [debouncedContent, promptId, prompt?.content, isCreateMode]);

  useEffect(() => {
    if (!promptId || isCreateMode || debouncedDescription === prompt?.description) return;
    
    updatePrompt(promptId, { description: debouncedDescription });
  }, [debouncedDescription, promptId, prompt?.description, isCreateMode]);

  const handleSaveNewPrompt = async () => {
    if (!title.trim()) {
      alert("Please enter a title for the prompt");
      return;
    }

    setIsSaving(true);
    try {
      // Get folderId from query parameter first, then fallback to localStorage
      let folderId = searchParams.get('folderId') || null;
      
      if (!folderId) {
        const savedFolder = localStorage.getItem('selectedFolder');
        if (savedFolder) {
          try {
            const parsedFolder = JSON.parse(savedFolder);
            folderId = parsedFolder.id;
          } catch (error) {
            console.error('Error parsing saved folder:', error);
          }
        }
      }

      const newPrompt = await createPrompt({
        title: title.trim(),
        content,
        description: description.trim() || undefined,
        folderId: folderId || undefined,
        tags,
      });

      // Navigate to the newly created prompt
      router.push(`/prompts/${newPrompt.id}`);
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert('Failed to create prompt. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/prompts');
  };

  const handleSave = async () => {
    if (isCreateMode) {
      await handleSaveNewPrompt();
    } else if (promptId) {
      onOpen("saveVersion", {
        promptData: { id: promptId, content, title, description },
        onSuccess: async () => {
          const fetchedPrompt = await getPromptById(promptId);
          setPrompt(fetchedPrompt as (Prompt & { tags: Tag[], versions: PromptVersion[] }) | null);
        },
      });
    }
  };

  const handleRestore = async () => {
    if (!promptId) return;
    const fetchedPrompt = await getPromptById(promptId);
    setPrompt(fetchedPrompt as (Prompt & { tags: Tag[], versions: PromptVersion[] }) | null);
    setContent(fetchedPrompt?.content || "");
  };

  const handleTagsChange = async (newTags: string[]) => {
    setTags(newTags);
    if (!isCreateMode && promptId) {
      // Update tags in real-time for edit mode
      await updatePrompt(promptId, { tags: newTags });
    }
  };

  if (!promptId || (!prompt && !isCreateMode)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full">
      {/* Main section: Editor taking almost all screen */}
      <div className="flex-grow flex flex-col">
        {/* Unified Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Input
              placeholder="Enter prompt title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow text-lg font-semibold"
            />
            <Button
              onClick={isCreateMode ? handleSaveNewPrompt : handleSave}
              disabled={isSaving || !title.trim()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isCreateMode
                ? isSaving
                  ? "Creating..."
                  : "Create Prompt"
                : isSaving
                ? "Saving..."
                : "Save"}
            </Button>
          </div>
        </div>

        {/* Description field above language dropdown */}
        <div className="h-32 p-4 border-b">
          <textarea
            placeholder="Enter prompt description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={256}
            className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {description.length}/256 characters
          </div>
        </div>

        {/* Language dropdown above editor */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Language:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {selectedLanguage}
                    <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {languageOptions.map((language) => (
                    <DropdownMenuItem
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                    >
                      {language}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {!isCreateMode && prompt?.versions?.[0]?.version && (
              <span className="text-sm text-gray-500">
                Version: {prompt.versions[0].version}
              </span>
            )}
          </div>
        </div>
        
        {/* Editor taking remaining space */}
        <div className="flex-grow">
          <Editor value={content} onChange={setContent} language={selectedLanguage} />
        </div>
      </div>
      
      {/* Right sidebar: TagInput at top, VersionHistorySidebar below */}
      <div className="w-80 border-l flex flex-col">
        <div className="h-32 p-4 border-b">
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <EnhancedTagInput
              selectedTags={tags}
              onTagsChange={handleTagsChange}
              placeholder="Add tags..."
            />
          </div>
        </div>
        {!isCreateMode && prompt && (
          <div className="flex-grow">
            <VersionHistorySidebar versions={prompt.versions} onRestore={handleRestore} />
          </div>
        )}
      </div>
    </div>
  );
}