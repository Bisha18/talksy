import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Navbar from './components/Navbar.jsx'
import { axiosInstance } from './lib/axios.js'
import {Loader} from "lucide-react";
import { useAuthStore } from './store/useAuthStore.js'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth}  = useAuthStore()

  useEffect(()=>{
    checkAuth();
  },[authUser])

  console.log({authUser})

  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin size-10'/>
      </div>
    )
  }
  return (
    <div data-theme = "cupcake">
      <Navbar/>
      <Routes>
        <Route path = '/' element = {authUser?<HomePage/>:<Navigate to = '/login'/>} />
        <Route path = '/signup' element = {!authUser?<SignUpPage/>:<Navigate to = '/'/>} />
        <Route path = '/login' element = {!authUser?<LoginPage/>:<Navigate to = '/'/>} />
        <Route path = '/profile' element = {<ProfilePage/>} />
      </Routes>
    </div>
  )
}

export default App