"use client";

import { useCallback, useEffect, useState } from "react";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getPromptsByFolder, movePrompt } from "@/app/actions/prompt.actions";
import type { Prompt, Tag } from "@/generated/prisma";
import Link from "next/link";
import { useModal } from "@/hooks/use-modal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type PromptWithTags = Prompt & { tags: Tag[] };

const PromptItem = ({ prompt }: { prompt: PromptWithTags }) => {
  const { onOpen } = useModal();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: prompt.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-4 hover:bg-muted">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Link href={`/prompts/${prompt.id}`} className="flex-grow" {...listeners}>
              <span>{prompt.title}</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Dropdown trigger clicked!");
                  }}
                >
                  <Icons.MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Rename clicked via onClick", prompt);
                    onOpen("renamePrompt", { prompt });
                  }}
                  onSelect={() => {
                    console.log("Rename clicked via onSelect", prompt);
                    onOpen("renamePrompt", { prompt });
                  }}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Move clicked via onClick", prompt);
                    onOpen("movePrompt", { prompt });
                  }}
                  onSelect={() => {
                    console.log("Move clicked via onSelect", prompt);
                    onOpen("movePrompt", { prompt });
                  }}
                >
                  Move to Folder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete clicked via onClick", prompt);
                    onOpen("deletePrompt", { prompt });
                  }}
                  onSelect={() => {
                    console.log("Delete clicked via onSelect", prompt);
                    onOpen("deletePrompt", { prompt });
                  }}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface PromptListProps {
  folderId?: string;
  prompts?: PromptWithTags[];
}

export const PromptList = ({ folderId, prompts: initialPrompts }: PromptListProps) => {
  const [prompts, setPrompts] = useState<PromptWithTags[]>(initialPrompts || []);
  const [wasCreatePromptOpen, setWasCreatePromptOpen] = useState(false);
  const { isOpen, type } = useModal();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchPrompts = useCallback(async () => {
    if (folderId !== undefined) {
      const fetchedPrompts = await getPromptsByFolder(folderId);
      setPrompts(fetchedPrompts as PromptWithTags[]);
    } else if (initialPrompts) {
      setPrompts(initialPrompts);
    } else {
      // Get unassigned prompts (folderId is null)
      const fetchedPrompts = await getPromptsByFolder();
      setPrompts(fetchedPrompts as PromptWithTags[]);
    }
  }, [folderId, initialPrompts]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Track when createPrompt modal is open
  useEffect(() => {
    if (isOpen && type === 'createPrompt') {
      setWasCreatePromptOpen(true);
    }
  }, [isOpen, type]);

  // Refresh prompts when createPrompt modal closes
  useEffect(() => {
    if (!isOpen && wasCreatePromptOpen) {
      setWasCreatePromptOpen(false);
      fetchPrompts();
    }
  }, [isOpen, wasCreatePromptOpen, fetchPrompts]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPrompts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        newItems.forEach((item, index) => {
          movePrompt(item.id, item.folderId, index);
        });

        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={prompts} strategy={verticalListSortingStrategy}>
        {prompts.map((prompt) => (
          <PromptItem key={prompt.id} prompt={prompt} />
        ))}
      </SortableContext>
    </DndContext>
  );
};