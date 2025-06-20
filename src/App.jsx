import PublicNavigator from "./navigators/PublicNavigator";
import { ToastContainer } from 'react-toastify';
import CartSidebar from "./components/CartSidebar";
import { useEffect } from "react";
import { useCartStore } from "./store/cartStore";
import { useAuthStore } from "./store/authStore"; // <-- IMPORT AUTH STORE

export default function App() {
  // Initialize cart from localStorage on app load
  const initializeCart = useCartStore(state => state.initializeCart);
  const fetchUser = useAuthStore(state => state.fetchUser); // <-- GET THE FUNCTION

  useEffect(() => {
    // This hook now runs on initial app mount and handles all global state initialization.
    initializeCart();
    fetchUser(); // <-- CALL THE FUNCTION TO RESTORE AUTH SESSION
  }, [initializeCart, fetchUser]); // <-- ADD DEPENDENCIES

  return (
    <main className="font-inter">
      <CartSidebar />
      <PublicNavigator />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </main>
  )
}