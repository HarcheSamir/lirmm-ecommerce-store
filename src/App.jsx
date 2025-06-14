import PublicNavigator from "./navigators/PublicNavigator";
import { ToastContainer } from 'react-toastify';
import CartSidebar from "./components/CartSidebar"; // <-- IMPORT
import { useEffect } from "react"; // <-- IMPORT
import { useCartStore } from "./store/cartStore"; // <-- IMPORT

export default function App() {
  // Initialize cart from localStorage on app load
  const initializeCart = useCartStore(state => state.initializeCart);
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  return (
    <main className="font-inter">
      <CartSidebar /> {/* <-- RENDER GLOBALLY */}
      <PublicNavigator />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </main>
  )
}