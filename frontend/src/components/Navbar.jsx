import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PopupMap from './PopupMap'
import Login from './login/Login'
import Signup from './login/Signup'
import { setIsOpen } from '../reducers/features/popup/loginPopup'
import { setOpen } from '../reducers/features/popup/mapPopup'
import { getLocation } from '../reducers/features/location/locationCoordinates'
import { setFilter } from '../reducers/features/listing/soListing'
import ThemeButton from './ThemeButton'
import NotificationBell from './NotificationBell'

const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // to open map popup
    const open = useSelector((state) => state.mapPopup.open)

    //to set our seaching range
    const radius = useSelector((state) => state.soListing.filter?.radius) || 5

    //to set location name on button
    const locName = useSelector((state) => state.location.currLocationName) || ''
    const soMainLocName = locName.split(',')[0] || 'Location'

    // to open login ,signup page
    const isOpen = useSelector((state) => state.loginPopup.isOpen)
    const isSignupOpen = useSelector((state) => state.signupPopup.isSignupOpen)

    // to check user is login or not
    const isLogin = useSelector((state) => state.login.isAuthenticated)
    const isSignup = useSelector((state) => state.signup.isAuthenticated)

    // find logged user to set that user data
    const user = useSelector((state) => state.signup.user || state.login.user);

    // to set name letter if profile image not present
    const findLoggedUser = user?.firstName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('') + user?.lastName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('')

    let UserAvatarName
    if (isLogin || isSignup) {
        UserAvatarName = findLoggedUser
    }

    const getCurrLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            dispatch(getLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
            );
            (error) => {
                console.log(error)
            }
        })
    }

    const [setSearch, setSetSearch] = useState('')

    const handleSearch = (e) => {
        setSetSearch(e.target.value)
    }

    const sendSearch = (e) => {
        if (e.key === "Enter") {
            dispatch(setFilter({ search: setSearch }));
            setSetSearch('')
            navigate('/')
        }
    }


    return (
        <>
            <nav className="flex justify-between items-center gap-4 z-10 px-5 py-3 border-b border-border sticky top-0 bg-white dark:bg-gray-900 dark:border-gray-400 transition-colors duration-300">
                {/* nav left */}
                <div className='flex w-190 items-center gap-4'>
                    <div onClick={() => navigate('/')} className='w-35  max-sm:hidden '>
                        <span className='text-primary text-logo font-extrabold font-stretch-200% cursor-pointer'>Loca</span>
                        <span className='text-logo font-extrabold font-stretch-200% cursor-pointer'>Sell</span>
                    </div>

                    <div onClick={() => navigate('/')} className='w-15 lg:hidden sm:hidden'>
                        <span className='text-primary text-logo font-extrabold font-stretch-200% cursor-pointer'>L</span>
                        <span className='text-logo font-extrabold font-stretch-200% cursor-pointer'>S</span>
                    </div>

                    <div className="border border-border dark:border-gray-400 rounded-xl flex-1 min-w-50 bg-white dark:bg-gray-800 lg:block md:hidden sm:hidden max-sm:hidden">
                        <input onKeyDown={sendSearch} onChange={handleSearch} value={setSearch} className='outline-none cursor-pointer text-h2 py-2 px-5 w-full rounded-xl bg-white text-black dark:bg-gray-800 dark:text-white'
                            type="search" placeholder='Search items, categories...' />
                    </div>

                    <div onClick={() => {
                        getCurrLocation()
                        dispatch(setOpen(true))
                    }} className='bg-secondary w-fit text-center text-text-dark border border-border rounded-xl cursor-pointer text-h2 pt-2 pl-4 pb-2 pr-4 lg:block md:hidden sm:hidden max-sm:hidden'>{soMainLocName} · {radius} km</div>
                </div>

                {/* nav right */}
                <div className='flex items-center gap-4 '>
                    <ThemeButton />
                    <NotificationBell />

                    {
                        user?._id ?
                            <div onClick={() => navigate('/profile')} className='bg-secondary text-text-dark rounded-full cursor-pointer w-9 h-9 p-2 text-h2 text-center font-bold '>{UserAvatarName}</div>
                            :
                            <button onClick={() => dispatch(setIsOpen(true))} className='bg-primary text-white text-h2 font-bold w-20 px-5 py-2 rounded-xl cursor-pointer'>Login</button>
                    }

                    <div onClick={() => navigate('/post-item')} className='bg-primary text-white text-center text-h2 font-bold rounded-xl cursor-pointer py-2 px-5 '>Sell</div>
                </div>
            </nav>

            {/* responsive */}
            <div className='lg:hidden w-full grid grid-cols-1 md:grid-cols-2 gap-2.5 px-5 py-3 border-b border-border '>
                <div className="border border-border dark:border-gray-400 rounded-xl w-full bg-white dark:bg-gray-800">
                    <input onKeyDown={sendSearch} onChange={handleSearch} value={setSearch} className='outline-none cursor-pointer text-h2 py-2 px-5 w-full rounded-xl bg-white text-black dark:bg-gray-800 dark:text-white'
                        type="search" placeholder='Search items, categories...' />
                </div>

                <div onClick={() => {
                    getCurrLocation()
                    dispatch(setOpen(true))
                }} className='bg-secondary w-full text-center text-text-dark border border-border rounded-xl cursor-pointer text-h2 pt-2 pl-4 pb-2 pr-4'>{soMainLocName} · {radius} km</div>
            </div>


            {/* to open popup map */}
            {
                open ?
                    <PopupMap />
                    :
                    null
            }

            {/* to open popup login  */}
            {
                isOpen ?
                    <Login />
                    :
                    null
            }

            {/* to open popup signup  */}
            {
                isSignupOpen ?
                    <Signup />
                    :
                    null
            }
        </>
    )
}

export default Navbar
