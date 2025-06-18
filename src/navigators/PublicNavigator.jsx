import React from 'react'
import { Route, Routes } from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import Test from '../pages/Test';
import Test2 from '../pages/Test2'
import Test3 from '../pages/Test3'
import NotFoundPage from '../pages/NotFoundPage';
import HomePage from '../pages/Home/HomePage'
import ProductDetailPage from '../pages/ProductDetailPage';
import CategoryPage from '../pages/CategoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage'; // <-- IMPORT NEW PAGE

export default function PublicNavigator() {
  return (
    <div>
      <Routes>
        {/* Core Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* *** CRITICAL FIX: Use the actual CheckoutPage component *** */}
        <Route path="/checkout" element={<CheckoutPage />} /> 
        <Route path="/order-confirmation/:orderId" element={<div>Order Confirmation Page</div>} /> 

        {/* Test Routes */}
        <Route path="/test" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/test3" element={<Test3 />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}