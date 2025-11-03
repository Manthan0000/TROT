// Frontend/app/types/Chat.ts
export interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  lastMessageTime?: string; // make optional to fix compatibility
  unreadCount?: number;
}
