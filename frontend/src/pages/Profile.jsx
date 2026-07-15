import React, { useEffect, useState } from 'react'
import ProfileSideBar from '../components/profile/ProfileSideBar'
import ProfileMain from '../components/profile/ProfileMain'
import { useNavigate } from 'react-router-dom'
import { setIsOpen } from '../reducers/features/popup/loginPopup'
import { useDispatch, useSelector } from 'react-redux'

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.signup.user || state.login.user);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            dispatch(setIsOpen(true))
            navigate('/')
        }
        if (!user) return navigate('/')
    }, [])

    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (
        <>
            <div className='flex mt-0 h-screen overflow-hidden'>
                <ProfileSideBar sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen} />
                <ProfileMain setSidebarOpen={setSidebarOpen} />
            </div>
        </>
    )
}

export default Profile
