import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SoMap from './SoMap'
import { submitSoOneListingData } from '../../reducers/features/listing/soOneListing'
import WishlistButton from '../WishlistButton'

const Main = ({ setSidebarOpen }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // filter products
    const filteredProducts = useSelector((state) => state.soListing?.soListing)

    // filter in this options
    const filters = useSelector((state) => state.soListing?.filter)

    const location = useSelector((state) => state.locationCoordinates.currLocation)

    // calculate distance from user
    const user = {
        lat: location?.lat,
        lng: location?.lng,
    };

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in K

        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (R * c).toFixed(2);
    }

    return (
        <>
            <div className='flex-1 lg:h-[calc(100vh_-_62px)] md:h-[calc(100vh_-_125px)] min-sm:h-[calc(100vh_-_175px)] h-[calc(100vh_-_175px)] mt-0 overflow-y-auto'>

                <div className='flex justify-between items-center border-b border-border pt-3 pr-5 pb-3 pl-5'>

                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-5'>
                            <button className=' block lg:hidden '>
                                <img onClick={() => setSidebarOpen(true)} className='w-5 inline-block cursor-pointer dark:invert-100 ' src="../../../src/assets/icons/hamburger.png" alt="" />
                            </button>
                            <span className='text-h2 font-semibold'>Nearby listings</span>
                        </div>
                    </div>

                    <div className='text-h3 text-gray-500'>{filteredProducts?.length || 0} results within {filters?.radius} km</div>
                </div>

                <SoMap />

                <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 p-5'>
                    {
                        filteredProducts?.map((item) => (
                            <div onClick={() => {
                                dispatch(submitSoOneListingData(item?._id))
                                navigate(`/product-details/${item?._id}`);
                            }} key={item?._id} className='border border-border rounded-xl cursor-pointer max-w-2xs'>
                                <div className='flex justify-center items-center bg-secondary relative h-40 overflow-hidden rounded-t-xl'>
                                    <img className='h-40 w-80 ' src={item?.image?.[0]} alt={item?.name} />
                                    {item?.status === 'sold' &&
                                        <div className='absolute flex justify-center items-center top-0 rounded-t-xl w-full h-full text-2xl bg-white/60'>Sold</div>
                                    }
                                </div>
                                <div onClick={(e) => e.stopPropagation()} className='grid p-3 relative'>
                                    <span className='text-[16px] text-primary font-bold'>₹ {item?.price}</span>
                                    <span className='text-h3 font-medium'>{item?.name}</span>
                                    <div className='flex justify-between items-center mt-1'>
                                        <span className='text-h4 text-gray-400'>{calculateDistance(user.lat, user.lng, item.location.coordinates?.[1], item.location.coordinates?.[0])} km</span>
                                        <span className='text-h6 bg-primary text-white rounded-full pt-0.5 pr-1.5 pb-0.5 pl-1.5'>{item?.condition}</span>
                                    </div>
                                    <WishlistButton product={item} />
                                </div>
                            </div>
                        ))
                    }
                </div>

                {
                    filteredProducts?.length < 1 || filteredProducts == undefined ?
                        <div className='p-5 text-center '>
                            <span className='font-bold'>Not present any product of this category on this range or area</span>
                        </div>
                        :
                        null
                }

            </div >
        </>
    )
}

export default Main
