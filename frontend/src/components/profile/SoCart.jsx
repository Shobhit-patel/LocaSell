import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WishlistButton from '../WishlistButton';
import { submitSoOneListingData } from '../../reducers/features/listing/soOneListing';
import hamburger from '../../assets/icons/hamburger.png'

const SoCart = ({setSidebarOpen}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cart } = useSelector((state) => state.cart);

    const location = useSelector((state) => state.locationCoordinates.currLocation)

    // calculate distance from user
    const user = {
        lat: location.lat,
        lng: location.lng,
    };

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in KM

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

    if (cart?.length == 0) {
        return (
            <div className='flex-1 text-center'>
                  <button className=' block lg:hidden text-right mb-5'>
                    <img onClick={() => setSidebarOpen(true)} className='w-5 cursor-pointer dark:invert-100' src={hamburger} alt="" />
                </button>
                <h1 className='font-extrabold font-stretch-150% text-logo mt-30'>Cart is empty</h1>
            </div>
        )
    }

    return (
        <>
            <button className=' block lg:hidden text-right mb-5'>
                <img onClick={() => setSidebarOpen(true)} className='w-5 cursor-pointer dark:invert-100' src={hamburger} alt="" />
            </button>
            <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4'>
                {
                    cart?.map((item) => (
                        <div onClick={() => {
                            dispatch(submitSoOneListingData(item?._id))
                            navigate('/product-details')
                        }} key={item?._id} className='border border-border rounded-xl cursor-pointer max-w-2xs'>
                            <div className='flex justify-center items-center bg-secondary h-40 relative overflow-hidden rounded-t-xl'>
                                <img className='h-40 w-80 ' src={item?.image?.[0]} alt={item?.name} />
                                {item?.status === 'sold' &&
                                    <div className='absolute flex justify-center items-center top-0 rounded-t-xl w-full h-full text-2xl bg-white/60'>Sold</div>
                                }
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className='grid p-3 relative'>
                                <span className='text-[16px] text-primary font-bold'>₹ {item?.price}</span>
                                <span className='text-h3 font-medium'>{item?.name}</span>
                                <div className='flex justify-between items-center mt-1'>
                                    <span className='text-h4 text-gray-400'>{calculateDistance(user.lat, user.lng, item?.location?.coordinates?.[1], item?.location?.coordinates?.[0])} km</span>
                                    <span className='text-h6 bg-primary text-white rounded-full pt-0.5 pr-1.5 pb-0.5 pl-1.5'>{item?.condition}</span>
                                </div>
                                <WishlistButton product={item} />
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default SoCart
