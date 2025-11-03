export interface ChatRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  message: string;
  createdAt: string;
}
