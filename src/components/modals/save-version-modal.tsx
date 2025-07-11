"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPromptVersion } from "@/app/actions/prompt.actions";
import { useRouter } from "next/navigation";

export function SaveVersionModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "saveVersion";
  const { promptData, onSuccess } = data;

  const [changeMessage, setChangeMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (versionType: "minor" | "major") => {
    if (!promptData?.id || !promptData.content) return;

    setIsSaving(true);
    try {
      await createPromptVersion({
        promptId: promptData.id,
        content: promptData.content,
        changeMessage: changeMessage.trim(),
        versionType,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
      router.refresh();
    } catch (error) {
      console.error(`Error creating ${versionType} version:`, error);
      // You might want to show a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setChangeMessage("");
    onClose();
  };

  if (!isModalOpen || !promptData) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save New Version</DialogTitle>
          <DialogDescription>
            Describe the changes you made. This will help you track the evolution of your prompt.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="e.g., Refined the introduction for clarity"
            value={changeMessage}
            onChange={(e) => setChangeMessage(e.target.value)}
            maxLength={200}
            rows={4}
          />
          <p className="text-xs text-right text-muted-foreground mt-2">
            {changeMessage.length} / 200
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleSave("minor")}
              disabled={isSaving}
              variant="secondary"
            >
              {isSaving ? "Saving..." : "Save as Minor Change"}
            </Button>
            <Button onClick={() => handleSave("major")} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save as Major Change"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}