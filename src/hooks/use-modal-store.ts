import { create } from 'zustand';
import type { Folder, Prompt } from '@/generated/prisma';

export type ModalType =
  | 'createFolder'
  | 'renameFolder'
  | 'deleteFolder'
  | 'createPrompt'
  | 'renamePrompt'
  | 'movePrompt'
  | 'deletePrompt';

interface ModalData {
  folder?: Folder;
  prompt?: Prompt;
  parentId?: string;
  folderId?: string;
  onSuccess?: () => void;
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