// @ts-nocheck
export interface Attachment {
  name: string;
  size: string;
  type: string;
}

export interface Email {
  id: number;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string;
  subject: string;
  body: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive' | 'spam';
  label?: 'Work' | 'Family' | 'Shop' | 'Personal' | 'Promotions';
  hasAttachment?: boolean;
  attachments?: Attachment[];
}

export interface EmailFolder {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

