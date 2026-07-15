import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/features/auth/login';
import { useLocation, useNavigate } from 'react-router-dom';
import { setIsActive } from '../../reducers/features/active/profile';

const ProfileSideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const { isActive } = useSelector((state) => state.profile)

    const handleLogout = () => {
        dispatch(logout());
        navigate('/')
        window.location.reload();
    };

    useEffect(() => {
        if (location.pathname === '/profile') {
            dispatch(setIsActive('profile'))
        }
    }, [location.pathname, dispatch])

    const user = useSelector((state) => state.signup.user || state.login.user);

    const findLoggedUser = user?.firstName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('') + user?.lastName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('')

    let UserAvatarName = findLoggedUser || 'US'

    return (
        <>
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 z-10 w-full sm:w-65 lg:w-65 lg:h-190 md:h-full sm:h-full max-sm:h-full border-r border-border overflow-y-auto transform transition-transform duration-300 bg-white text-black dark:bg-gray-900 dark:text-white ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-auto lg:h-full lg:w-65 lg:translate-x-0  `}
            >

                <div className='p-4 lg:h-190 md:h-full sm:h-full max-sm:h-full overflow-y-auto scrollbar-thumb-white'>
                    <div className='text-right'>
                        <button onClick={() => setSidebarOpen(false)} className='cursor-pointer lg:hidden '> ✕ </button>
                    </div>

                    <div className='flex justify-center items-center mb-5'>
                        <div className='bg-secondary text-text-dark rounded-full w-30 h-30 pt-8 text-5xl  text-center font-bold '>{UserAvatarName}</div>
                    </div>

                    <div className='grid gap-1 mb-5'>
                        <span onClick={() => {
                            dispatch(setIsActive('profile'))
                            setSidebarOpen(false)
                        }} className={`hover:bg-secondary dark:hover:text-text-dark px-5 py-1 rounded-xl text-h2 cursor-pointer ${isActive === 'profile' ? 'bg-secondary text-text-dark' : null}`}>Profile</span>

                        <span onClick={() => {
                            dispatch(setIsActive('listing'))
                            setSidebarOpen(false)
                        }} className={`hover:bg-secondary dark:hover:text-text-dark px-5 py-1 rounded-xl text-h2 cursor-pointer ${isActive === 'listing' ? 'bg-secondary text-text-dark' : null}`}>Listing</span>

                        <span onClick={() => {
                            dispatch(setIsActive('wishlist'))
                            setSidebarOpen(false)
                        }} className={`hover:bg-secondary dark:hover:text-text-dark px-5 py-1 rounded-xl text-h2 cursor-pointer ${isActive === 'wishlist' ? 'bg-secondary text-text-dark' : null}`}>Wishlist</span>

                        <span onClick={() => {
                            dispatch(setIsActive('cart'))
                            setSidebarOpen(false)
                        }} className={`hover:bg-secondary dark:hover:text-text-dark px-5 py-1 rounded-xl text-h2 cursor-pointer ${isActive === 'cart' ? 'bg-secondary text-text-dark' : null}`}>Cart</span>

                        <span onClick={() => {
                            dispatch(setIsActive('messageSeller'))
                            navigate('/message-seller')
                            setSidebarOpen(false)
                        }} className={`hover:bg-secondary dark:hover:text-text-dark px-5 py-1 rounded-xl text-h2 cursor-pointer ${isActive === 'messageSeller' ? 'bg-secondary text-text-dark' : null}`}>Message seller</span>
                    </div>

                    <div onClick={handleLogout} className='bg-primary text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-4 pt-3 pb-3'>
                        <button className='cursor-pointer'>Log out</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileSideBar
