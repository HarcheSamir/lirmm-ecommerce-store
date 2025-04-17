import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import NotFoundPage from '../pages/NotFoundPage';
import useLayoutStore from '../store/layoutStore';
export default function DashboardNavigator() {
 const {swithSidebar} = useLayoutStore()
  return (
    <div className='h-full overflow-y-scroll px-4 pt-2'>
      <Routes>
        <Route path="/" element={<p onClick={()=>{swithSidebar}}  className='h-[150vh] '>hey</p>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
