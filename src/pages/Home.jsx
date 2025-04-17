
import DashboardNavigator from "../navigators/DashboardNavigator"
import Sidebar from "../layouts/Sidebar"
import Topbar from "../layouts/Topbar"
export default function Home() {

    return (
        <div className='h-full min-h-screen overflow-clip flex flex-row relative '>
            <Sidebar />
            <div className=' duration-200  h-screen  lg:relative  fixed top-0 left-0 w-full flex flex-col'>
                <Topbar />
                <DashboardNavigator />
            </div>

        </div>
    )
}

