import PublicNavigator from "./navigators/PublicNavigator";
import { ToastContainer } from 'react-toastify';
export default function App() {
  return (
    <>
      <PublicNavigator />
      <ToastContainer  position="bottom-right" />
    </>
  )
}
