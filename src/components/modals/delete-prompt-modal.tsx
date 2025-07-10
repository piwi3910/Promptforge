"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { deletePrompt } from "@/app/actions/prompt.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeletePromptModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "deletePrompt";
  const { prompt } = data;

  const handleDelete = async () => {
    if (!prompt) return;
    
    try {
      setLoading(true);
      await deletePrompt(prompt.id);
      onClose();
      window.location.reload(); // Refresh to show changes
    } catch (error) {
      console.error("Failed to delete prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Prompt</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{prompt?.title}&rdquo;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};