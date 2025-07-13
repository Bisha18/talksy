import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import { useAuthStore } from '../store/useAuthStore';
import { io } from 'socket.io-client';

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser, setSocket, setOnlineUsers } = useAuthStore();
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

  useEffect(() => {
    // This effect is now safe because App.jsx ensures authUser exists before rendering HomePage
    if (authUser) {
      const socket = io(SOCKET_URL, {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      // Listen for online users
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup function to close the socket when the user logs out or the component unmounts
      return () => socket.close();
    }
  }, [authUser, setSocket, setOnlineUsers, SOCKET_URL]);

  return (
    <div className="h-screen bg-base-200">
      <div className='flex items-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
           <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;