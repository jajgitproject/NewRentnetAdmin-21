// @ts-nocheck
export type FileElementType = 'folder' | 'file';

export interface FileElement {
  id: string;
  name: string;
  type: FileElementType;
  size?: number; // in bytes
  date: Date;
  starred: boolean;
  parentId: string | null;
  extension?: string;
  color?: string; // for folders
  icon?: string;
}

export interface StorageInfo {
  total: number;
  used: number;
  categories: {
    name: string;
    used: number;
    color: string;
    icon: string;
  }[];
}

