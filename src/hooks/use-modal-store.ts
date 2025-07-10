import { create } from 'zustand';
import type { Folder, Prompt } from '@/generated/prisma';

export type ModalType =
  | 'createFolder'
  | 'renameFolder'
  | 'deleteFolder'
  | 'createPrompt'
  | 'renamePrompt'
  | 'movePrompt'
  | 'deletePrompt'
  | 'createTag'
  | 'editTag'
  | 'deleteTag'
  | 'changePassword';

// Simple tag interface for modal data
export interface TagData {
  id: string;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ModalData {
  folder?: Folder;
  prompt?: Prompt;
  tag?: TagData;
  parentId?: string;
  folderId?: string;
  onSuccess?: (result?: TagData | void) => void;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));