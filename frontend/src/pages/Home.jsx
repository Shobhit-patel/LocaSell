import React, { useEffect, useState } from 'react'
import SideBar from '../components/homepage/SideBar'
import Main from '../components/homepage/Main'

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className='flex mt-0 h-screen overflow-hidden'>
                <SideBar sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen} />
                <Main setSidebarOpen={setSidebarOpen} />
            </div>
        </>
    )
}

export default Home
