import React from 'react'
import { useAuthStore } from '../store/authStore'
import { RiMenu2Fill } from "react-icons/ri";
import useLayoutStore from '../store/layoutStore';
import Sidebar from './Sidebar';
export default function Topbar() {
  const { user, logout, hasRole } = useAuthStore()
  const { switchSidebar , switchMiniSidebar, sidebar, miniSidebar} = useLayoutStore()
  const handleLogout = () => {
    logout()
    // navigate('/')
  }
  return (
    <div className='w-full h-[70px] items-center px-4  gap-4 border-b border-gray-200 shadow-xs flex'>
      <RiMenu2Fill onClick={switchMiniSidebar} className='text-2xl lg:block hidden cursor-pointer text-zinc-500' />
      <RiMenu2Fill onClick={switchSidebar} className={`text-2xl lg:hidden  cursor-pointer duration-200 text-zinc-500 ${sidebar && 'ml-[16rem]'}`} />
       <p className='cursor-pointer ml-auto text-red-500' onClick={logout}>logout</p>

    </div>
  )
}
