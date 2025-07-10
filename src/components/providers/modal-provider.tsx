"use client";

import { useEffect, useState } from "react";
import { CreateFolderModal } from "../modals/create-folder-modal";
import { RenameFolderModal } from "../modals/rename-folder-modal";
import { DeleteFolderModal } from "../modals/delete-folder-modal";
import { CreatePromptModal } from "../modals/create-prompt-modal";
import { RenamePromptModal } from "../modals/rename-prompt-modal";
import { MovePromptModal } from "../modals/move-prompt-modal";
import { DeletePromptModal } from "../modals/delete-prompt-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateFolderModal />
      <RenameFolderModal />
      <DeleteFolderModal />
      <CreatePromptModal />
      <RenamePromptModal />
      <MovePromptModal />
      <DeletePromptModal />
    </>
  );
};