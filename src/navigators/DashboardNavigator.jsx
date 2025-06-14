import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import NotFoundPage from '../pages/NotFoundPage';
import useLayoutStore from '../store/layoutStore';
import HomePage from '../pages/Home/HomePage'
export default function DashboardNavigator() {
  const { swithSidebar } = useLayoutStore()
  return (
    <div className='h-full overflow-y-scroll '>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </div>
  )
}
