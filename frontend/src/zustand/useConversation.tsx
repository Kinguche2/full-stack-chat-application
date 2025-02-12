import { create } from "zustand";
import {
  conversations,
  messages,
  selectedConversation,
} from "../Dto/messages";

const useConversation = create<conversations>((set) => ({
  selectedConversation: null,
  setCurrentConversation: (selectedConversation: selectedConversation | null) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages: messages[]) => set({ messages: messages }),
}));

export default useConversation;
