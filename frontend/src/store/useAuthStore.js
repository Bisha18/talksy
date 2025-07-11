import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data); // corrected "/suth/signup" to "/auth/signup"
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed"); // safer error handling
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout:async()=>{
    try{
     await axiosInstance.post("/auth/logout");  
     set({authUser:null})
     toast.success("User logged out successfully");
    }catch(error){
      toast.error(error?.response?.data?.message || "Logout failed"); 
    }
  },
  login:async(data)=>{
    set({isLoggingIn:true});
    try{
      const res = await axiosInstance.post("/auth/login",data);
      set({authUser:res.data});
      toast.success("User logged in successfully");
    }catch(error){
      toast.error(error?.response?.data?.message || "Login failed"); 
    }finally{
      set({isLoggingIn:false});
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
