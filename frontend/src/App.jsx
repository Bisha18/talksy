import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // This effect runs only once to check if the user is already logged in.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // CRITICAL FIX: Show a full-page loader while checking auth.
  // This prevents the app from trying to connect to websockets before knowing who the user is.
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Toaster />
    </>
  );
}

export default App;