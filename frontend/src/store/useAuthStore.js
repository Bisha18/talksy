import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set)=>({
  authUser:null,
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth:true,
  checkAuth: async()=>{
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({authUser:res.data})
    } catch (error) {
      set({authUser:null})
      console.log(error);
    }finally{
      set({isCheckingAuth:false})
    }
  }
}))