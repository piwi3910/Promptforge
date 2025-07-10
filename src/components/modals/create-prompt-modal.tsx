"use client";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { createPrompt } from "@/app/actions/prompt.actions";
import { Editor } from "@/components/editor/editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "../ui/badge";

export const CreatePromptModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Text");

  const languageOptions = ["Markdown", "Text", "Yaml", "Json", "XML"];
  const isModalOpen = isOpen && type === "createPrompt";

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setSelectedLanguage("Text");
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() === "" || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a title for the prompt");
      return;
    }
    
    try {
      console.log("Creating prompt with data:", {
        title: title.trim(),
        content: content.trim(),
        folderId: data.folderId || data.folder?.id,
        tags: tags,
      });
      
      const result = await createPrompt({
        title: title.trim(),
        content: content.trim(),
        folderId: data.folderId || data.folder?.id,
        tags: tags,
      });
      
      console.log("Prompt created successfully:", result);
      
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      setSelectedLanguage("Text");
      onClose();
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt. Please check the console for details.");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <div className="flex h-full">
          {/* Main section: Editor taking almost all screen */}
          <div className="flex-grow flex flex-col">
            {/* Header with title and language dropdown */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Create New Prompt</h2>
                <div className="flex items-center gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title:</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter prompt title"
                    className="w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
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
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} variant="default">
                    Create Prompt
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Editor taking remaining space */}
            <div className="flex-grow">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>
          
          {/* Right sidebar: Tags */}
          <div className="w-80 border-l flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium mb-3">Tags</h3>
              <div className="flex gap-2 mb-3 flex-wrap">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} size="sm">Add</Button>
              </div>
            </div>
            <div className="flex-grow p-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Use tags to organize your prompts</li>
                  <li>• Press Enter to add a tag quickly</li>
                  <li>• Choose the appropriate language for syntax highlighting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};