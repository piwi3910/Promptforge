"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { addTagToPrompt, removeTagFromPrompt } from "@/app/actions/tag.actions";

interface TagInputProps {
  promptId: string;
  initialTags?: { id: string; name: string }[];
}

export const TagInput = ({ promptId, initialTags }: TagInputProps) => {
  const [tags, setTags] = useState(initialTags || []);
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = async () => {
    if (inputValue.trim() === "") return;
    await addTagToPrompt(promptId, inputValue);
    setTags([...tags, { id: "", name: inputValue }]);
    setInputValue("");
  };

  const handleRemoveTag = async (tagName: string) => {
    await removeTagFromPrompt(promptId, tagName);
    setTags(tags.filter((tag) => tag.name !== tagName));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
            <button
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleRemoveTag(tag.name)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag"
        />
        <Button onClick={handleAddTag}>Add</Button>
      </div>
    </div>
  );
};