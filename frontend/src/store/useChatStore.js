import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            const messages = Array.isArray(res.data) ? res.data : res.data.messages;

            if (!Array.isArray(messages)) throw new Error("Invalid message format");

            set({ messages });
        } catch (error) {
            console.error("Get messages error:", error);
            toast.error(error?.response?.data?.message || "Failed to load messages");
            set({ messages: [] }); 
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser } = get();
        const currentMessages = Array.isArray(get().messages) ? get().messages : [];

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...currentMessages, res.data.newMessage] });

        } catch (error) {
            console.error("Send message error:", error);
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },
    subscribeToMessage : () => {
        const {selectedUser} = get()
        if(!selectedUser) return;

       const socket = useAuthStore.getState().socket

       socket.on("newMessage",(newMessage) => {
        const isMessageSentFromSelectedUser =newMessage.senderId !== selectedUser._id
        if(!isMessageSentFromSelectedUser) return;
            set({
                messages : [...get().messages,newMessage]
            })
       })
    },
    unsubscribeFromMessages : () =>{
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },
    setSelectedUser: (selectedUser) => set({ selectedUser })
}))