import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductUser } from '../../reducers/features/productUserSlice'
import ImagePopup from '../ImagePopup'
import { setImagePopupOpen, setImageUrl } from '../../reducers/features/imagePopupSlice'
import right from '../../assets/icons/right.png'
import hamburger from '../../assets/icons/hamburger.png'
import WishlistButton from '../WishlistButton'
import rightArrow from '../../assets/icons/right.svg'
import leftArrow from '../../assets/icons/left.svg'

const ProductMain = ({ setSidebarOpen }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const product = useSelector((state) => state.soOneListing?.soOneListingProduct)

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (product?.seller) {
            dispatch(getProductUser(product.seller))
        }
    }, [product?.seller, dispatch])

    const coordinate = product?.location?.coordinates
    const [sellerLocation, setSellerLocation] = useState('')

    const location = useSelector((state) => state.locationCoordinates.currLocation)

    useEffect(() => {
        const fetchName = async () => {
            if (!coordinate?.[0] || !coordinate?.[1]) return;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${coordinate[1]}&lon=${coordinate[0]}&format=json`
                );

                if (!res.ok) return;

                const data = await res.json();
                const a = data?.display_name?.split(',')[0];

                setSellerLocation(a || '');
            } catch (error) {
                console.error("Location fetch failed:", error);
            }
        };

        fetchName();
    }, [coordinate]);

    const isOpen = useSelector((state) => state.imagePopup.imagePopupOpen)

    function getTimeLabel(timestamp) {
        const diffDays = Math.floor(
            (Date.now() - new Date(timestamp).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays === 7) return "1 week ago";

        return `${diffDays} days ago`;
    }

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

    return (
        <>
            <div className='flex-1 p-5 lg:h-[calc(100vh_-_62px)] md:h-[calc(100vh_-_125px)] min-sm:h-[calc(100vh_-_175px)] h-[calc(100vh_-_175px)] mt-0 overflow-y-auto'>

                <div className='flex items-center gap-2' >
                    <div className='flex items-center gap-1 lg:gap-2 w-full'>
                        <span onClick={() => navigate('/')} className='text-gray-500 dark:text-gray-400 text-h2 cursor-pointer '>Home </span>
                        <img className='w-3 h-3 opacity-70 dark:invert' src={right} alt="" />
                        <span onClick={() => navigate('/')} className='text-gray-500 dark:text-gray-400 text-h2 cursor-pointer '>{product?.category} </span>
                        <img className='w-3 h-3 opacity-70 dark:invert' src={right} alt="" />
                        <span className='text-black dark:text-white font-medium text-h2'>{product?.name}</span>
                    </div>

                    <button className=' block lg:hidden  text-right '>
                        <img onClick={() => setSidebarOpen(true)} className='w-5 inline-block cursor-pointer dark:invert-100' src={hamburger} alt="" />
                    </button>
                </div>

                <div onClick={() => {
                    dispatch(setImagePopupOpen(true))
                    dispatch(setImageUrl(product?.image?.[count]))
                }} className='flex justify-center items-center border border-border relative rounded-xl cursor-pointer overflow-hidden h-70 mt-5 bg-secondary'>
                    <div className='absolute top-5 right-5 z-5' onClick={(e) => e.stopPropagation()}>
                        <WishlistButton product={product} />
                    </div>

                    <div className='absolute left-2 sm:left-5 z-5' onClick={(e) => e.stopPropagation()}>
                        {
                            count !== 0 &&
                            <img onClick={() => setCount(count - 1)} className='w-9 sm:w-10 md:w-10 rounded-full bg-white p-2' src={leftArrow} alt="arrow" />
                        }
                    </div>
                    <div className='absolute right-2 sm:right-5 z-5' onClick={(e) => e.stopPropagation()}>
                        {
                            count !== product?.image?.length - 1 &&
                            <img onClick={() => setCount(count + 1)} className='w-9 sm:w-10 md:w-10 rounded-full bg-white p-2' src={rightArrow} alt="arrow" />
                        }
                    </div>

                    {product?.status === 'sold' &&
                        <div className='absolute flex justify-center items-center w-full h-70 text-3xl bg-white/60'>Sold</div>
                    }

                    <img className='h-69.5' src={product?.image?.[count]} alt={product?.name} />
                </div>

                <div className='flex mt-2.5 gap-2.5 '>
                    {
                        product?.image?.map((i, key) => (
                            <div key={key} onClick={() => setCount(key)} className={`bg-secondary rounded-xl cursor-pointer place-items-center w-fit h-20 border transition-all duration-200 ${count === key
                                ? "border-primary "
                                : "border-border hover:border-primary"
                                }`}
                            >
                                <img className='h-19.5 p-[0.2px] overflow-hidden rounded-xl' src={i} alt="product" />
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-center gap-5 mt-2.5'>
                    <span className='text-[35px] text-primary font-bold'>₹ {product?.price}</span>
                    <span className='text-h3 bg-secondary text-text-dark rounded-full py-0.5 px-3'>{product?.condition}</span>
                </div>

                <div>
                    <span className='text-logo font-medium'>{product?.name}</span>
                </div>

                <div className='flex gap-2 mt-2.5'>
                    <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>{product?.category}</button>
                    {
                        location.lat !== 0 && location.lng !== 0 ?
                            <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>{calculateDistance(user?.lat, user?.lng, product?.location?.coordinates?.[1], product?.location?.coordinates?.[0])} km · {sellerLocation}</button>
                            :
                            <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>{sellerLocation}</button>
                    }
                    <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>Listed {getTimeLabel(product?.createdAt)}</button>
                </div>


                <div className='text-h1 mt-5'>
                    <div className='grid'>
                        <span className='text-h1 text-gray-500 font-medium'>Description</span>
                        <span className='text-h1'>{product?.description}</span>
                    </div>

                    <div className='grid grid-cols-2  mt-5'>
                        {Object.entries(product?.categoryData || {}).map(([key, value]) => (
                            <div key={key}>
                                <div className='grid mb-3'>
                                    <span className='text-h4 text-gray-500 font-medium'>{key?.charAt(0)?.toUpperCase() + key?.slice(1)}</span>
                                    <span className='text-h2'>{value}</span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            </div >

            {
                isOpen ?
                    <ImagePopup />
                    :
                    null
            }
        </>
    )
}

export default ProductMain
