"use client";

import { CreateFolderModal } from "./create-folder-modal";
import { RenameFolderModal } from "./rename-folder-modal";
import { DeleteFolderModal } from "./delete-folder-modal";
import { CreatePromptModal } from "./create-prompt-modal";
import { RenamePromptModal } from "./rename-prompt-modal";
import { MovePromptModal } from "./move-prompt-modal";
import { DeletePromptModal } from "./delete-prompt-modal";
import { CreateTagModal } from "./create-tag-modal";
import { EditTagModal } from "./edit-tag-modal";
import { DeleteTagModal } from "./delete-tag-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateFolderModal />
      <RenameFolderModal />
      <DeleteFolderModal />
      <CreatePromptModal />
      <RenamePromptModal />
      <MovePromptModal />
      <DeletePromptModal />
      <CreateTagModal />
      <EditTagModal />
      <DeleteTagModal />
    </>
  );
};