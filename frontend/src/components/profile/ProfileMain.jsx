import React from 'react'
import { useSelector } from 'react-redux'
import SoProfile from './SoProfile'
import SoListing from './SoListing'
import SoWishlist from './SoWishlist'
import SoCart from './SoCart'

const ProfileMain = ({ setSidebarOpen }) => {
    const isActive = useSelector((state) => state.profile.isActive)

    return (
        <>
            <div className='flex-1 p-5 lg:h-[calc(100vh_-_62px)] md:h-[calc(100vh_-_125px)] min-sm:h-[calc(100vh_-_175px)] h-[calc(100vh_-_175px)] mt-0 overflow-y-auto'>
                {isActive === 'profile' ?
                    <SoProfile setSidebarOpen={setSidebarOpen} />
                    :
                    null
                }
                {isActive === 'listing' ?
                    <SoListing setSidebarOpen={setSidebarOpen} />
                    :
                    null
                }
                {isActive === 'wishlist' ?
                    <SoWishlist setSidebarOpen={setSidebarOpen} />
                    :
                    null
                }
                {isActive === 'cart' ?
                    <SoCart setSidebarOpen={setSidebarOpen} />
                    :
                    null
                }
            </div>
        </>
    )
}

export default ProfileMain
