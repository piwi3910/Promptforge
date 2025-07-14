"use client";

import { useState, useEffect } from "react";
import { getTagsWithPrompts } from "@/app/actions/tag-management.actions";
import { getAllPrompts } from "@/app/actions/prompt.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cardHover, containerPadding } from "@/lib/styles";

interface Prompt {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

interface TaggedPromptsListProps {
  selectedTagId: string | null;
  selectedTagName: string;
}

export const TaggedPromptsList = ({ selectedTagId, selectedTagName }: TaggedPromptsListProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        if (selectedTagId === null) {
          // Show all prompts
          const allPrompts = await getAllPrompts();
          setPrompts(allPrompts);
        } else {
          // Show prompts for specific tag
          const tagsWithPrompts = await getTagsWithPrompts();
          const selectedTag = tagsWithPrompts.find(tag => tag.id === selectedTagId);
          setPrompts(selectedTag?.prompts || []);
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [selectedTagId]);

  const handlePromptClick = (promptId: string) => {
    router.push(`/prompts/${promptId}`);
  };


  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerPadding()}>
      <div className="mb-4">
        <div>
          <span className="font-medium">
            Selected tag: <span className="text-blue-500">{selectedTagName}</span>
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'} found
          </p>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Icons.File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No prompts found</h3>
            <p className="text-muted-foreground">
              {selectedTagId === null
                ? "You haven't created any prompts yet."
                : `No prompts are tagged with "${selectedTagName}".`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={cardHover()}
              onClick={() => handlePromptClick(prompt.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <CardDescription>
                      {prompt.description || "No description"}
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground ml-4">
                    <p>Updated {format(new Date(prompt.updatedAt), "MMM d, yyyy")}</p>
                    <p>Created {format(new Date(prompt.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </div>
              </CardHeader>
              {prompt.tags && prompt.tags.length > 0 && (
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};