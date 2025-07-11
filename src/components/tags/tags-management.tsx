"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Tag as TagIcon } from "lucide-react";
import { useModal, type TagData } from "@/hooks/use-modal-store";

interface Tag {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: {
    prompts: number;
  };
}

interface TagsManagementProps {
  initialTags: Tag[];
}

export function TagsManagement({ initialTags }: TagsManagementProps) {
  const [tags, setTags] = useState(initialTags);
  const { onOpen } = useModal();

  const handleCreateTag = () => {
    onOpen("createTag", {
      onSuccess: (newTag?: TagData | void) => {
        if (newTag && typeof newTag === 'object') {
          setTags(prev => [...prev, { ...newTag, createdAt: new Date(), _count: { prompts: 0 } }]);
        }
      }
    });
  };

  const handleEditTag = (tag: Tag) => {
    onOpen("editTag", {
      tag,
      onSuccess: (updatedTag?: TagData | void) => {
        if (updatedTag && typeof updatedTag === 'object') {
          setTags(prev => prev.map(t => t.id === updatedTag.id ? { ...t, ...updatedTag } : t));
        }
      }
    });
  };

  const handleDeleteTag = (tag: Tag) => {
    onOpen("deleteTag", {
      tag,
      onSuccess: () => {
        setTags(prev => prev.filter(t => t.id !== tag.id));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Tags</h2>
          <p className="text-sm text-muted-foreground">
            {tags.length} tag{tags.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={handleCreateTag} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tags yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first tag to start organizing your prompts.
            </p>
            <Button onClick={handleCreateTag}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tags.map((tag) => (
            <Card key={tag.id} className="relative group text-sm">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <TagIcon className="h-3 w-3" />
                      {tag.name}
                    </div>
                    {tag.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {tag.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleEditTag(tag)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteTag(tag)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <Badge variant="secondary" className="px-1.5 py-0.5">
                    {tag._count.prompts} prompt{tag._count.prompts !== 1 ? 's' : ''}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}