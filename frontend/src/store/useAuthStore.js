import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import {io} from 'socket.io-client'
const BASE_URL = "https://mern-chat-web-app-backend.onrender.com"
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers : [],
  socket : null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
      get().connectSocket()
    } catch (error) {
      set({ authUser: null })

    } finally {
      set({ isCheckingAuth: false })
    }
  },
  signup: async (data) => {
    console.log("Sending signup request with:", data);
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("logged in successfully");
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },
  logout: async () => {
    try {
      await axiosInstance.delete("/auth/logout")
      set({ authUser: null })
      toast.success("logout successfully")
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update-profile",data)
      set({authUser : res.data})
      toast.success("profile updated successfully")
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
  connectSocket: () =>{
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query : {
        userId : authUser._id
      },
        transports: ["websocket"], 
       secure: true,
  withCredentials: true,
    })
    set({socket : socket})
    socket.on("getOnlineUsers", (userIds)=>{
          set({onlineUsers : userIds})
    })
  },
  disconnectSocket: () =>{
    if (get().socket?.connected) get().socket.disconnect();
  }

}))
