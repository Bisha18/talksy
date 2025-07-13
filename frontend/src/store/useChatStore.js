import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

const handleNewMessage = (message) => {
  const { messages, selectedUser, setMessages } = useChatStore.getState();
  const { authUser } = useAuthStore.getState();

  const isRelevant =
    (message.senderId === selectedUser?._id && message.receiverId === authUser?._id) ||
    (message.senderId === authUser?._id && message.receiverId === selectedUser?._id);

  if (isRelevant) {
    setMessages([...messages, message]);
  }
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setMessages: (messages) => set({ messages }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      // FIX: Add /api prefix
      const res = await axiosInstance.get(`/api/messages/users`);
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      // FIX: Add /api prefix
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;
    try {
      // FIX: Add /api prefix
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, messages: [] });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.on("newMessage", handleNewMessage);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage", handleNewMessage);
  },
}));