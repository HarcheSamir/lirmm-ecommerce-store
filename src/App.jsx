import PublicNavigator from "./navigators/PublicNavigator";
import { ToastContainer } from 'react-toastify';
export default function App() {
  return (
    <main className="font-inter">
      <PublicNavigator />
      <ToastContainer  position="bottom-right" />
    </main>
  )
}
