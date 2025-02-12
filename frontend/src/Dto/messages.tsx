import { Date, Types } from "mongoose";

export interface selectedConversation {
  _id: Types.ObjectId;
  email: string;
  profileImage?: string;
  gender?: string;
  emailVerified?: boolean;
  token?: string;
  firstName?: string;
  lastName?: string;
}

export interface messages {
  message?: string;
  senderId?: Types.ObjectId;
  receiverId?: Types.ObjectId;
  _id?: Types.ObjectId;
  createdAt?: Date;
  shouldShake: boolean;
}

export interface conversations {
  selectedConversation: selectedConversation | null;
  messages: messages[];
  setCurrentConversation: (
    selectedConversation: selectedConversation | null
  ) => void;
  setMessages: (messages: messages[]) => void;
}
