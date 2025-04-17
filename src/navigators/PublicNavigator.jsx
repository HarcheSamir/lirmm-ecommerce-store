import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import WithAuth from '../hocs/WithAuth'
import Home from '../pages/Home';
import DashboardNavigator from './DashboardNavigator';
import Test from '../pages/Test';
import NotFoundPage from '../pages/NotFoundPage';
export default function PublicNavigator() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<WithAuth><Home /></WithAuth>} />
        <Route path="/" element={<WithAuth><DashboardNavigator /></WithAuth>} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </div>
  )
}
