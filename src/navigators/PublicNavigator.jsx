import React from 'react'
import { Route, Routes } from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Test from '../pages/Test';
import Test2 from '../pages/Test2'
import Test3 from '../pages/Test3'
import NotFoundPage from '../pages/NotFoundPage';
import HomePage from '../pages/Home/HomePage'
import ProductDetailPage from '../pages/ProductDetailPage';
import ShopPage from '../pages/ShopPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

export default function PublicNavigator() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:categorySlug" element={<ShopPage />} />
        
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<div>Order Confirmation Page</div>} />
        
        <Route path="/test" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/test3" element={<Test3 />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}