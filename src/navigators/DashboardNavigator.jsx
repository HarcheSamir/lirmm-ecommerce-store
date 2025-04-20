import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import NotFoundPage from '../pages/NotFoundPage';
import useLayoutStore from '../store/layoutStore';
import ProductList from '../pages/ProductList'
import ProductCreate from '../pages/ProductCreate'
import OrderList from '../pages/OrderList'
import OrderCreate from '../pages/OrderCreate'
import AccountList from '../pages/AccountList'
import AccountCreate from '../pages/AccountCreate'
import CategoryCreate from '../pages/CategoryCreate';
import CategoryList from '../pages/CategoryList';
import Stock from '../pages/Stock';
import ReviewsList from '../pages/ReviewsList'
import Statistics from '../pages/Statistics'
export default function DashboardNavigator() {
  const { swithSidebar } = useLayoutStore()
  return (
    <div className='h-full overflow-y-scroll '>
      <Routes>
        <Route path="/" element={<Statistics />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/stock" element={<Stock />} />
        <Route path="/products/reviews" element={<ReviewsList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/create" element={<OrderCreate />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/accounts" element={<AccountList />} />
        <Route path="/accounts/create" element={<AccountCreate />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </div>
  )
}
