import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductUser } from '../../reducers/features/productUserSlice'
import ImagePopup from '../ImagePopup'
import { setImagePopupOpen, setImageUrl } from '../../reducers/features/imagePopupSlice'

const ProductMain = ({ setSidebarOpen }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const product = useSelector((state) => state.soOneListing?.soOneListingProduct)

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (product?.image?.length) {
            setPreview(product.image[0]);
        }
    }, [product]);

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
                        <img className='w-3 h-3 opacity-70 dark:invert' src="../../../src/assets/icons/right.png" alt="" />
                        <span onClick={() => navigate('/')} className='text-gray-500 dark:text-gray-400 text-h2 cursor-pointer '>{product?.category} </span>
                        <img className='w-3 h-3 opacity-70 dark:invert' src="../../../src/assets/icons/right.png" alt="" />
                        <span className='text-black dark:text-white font-medium text-h2'>{product?.name}</span>
                    </div>

                    <button className=' block lg:hidden  text-right '>
                        <img onClick={() => setSidebarOpen(true)} className='w-5 inline-block cursor-pointer dark:invert-100' src="../../../src/assets/icons/hamburger.png" alt="" />
                    </button>
                </div>



                <div onClick={() => {
                    dispatch(setImagePopupOpen(true))
                    dispatch(setImageUrl(preview))
                }} className='flex justify-center items-center border border-border relative rounded-xl cursor-pointer overflow-hidden h-70 mt-5 bg-secondary'>
                    {product?.status === 'sold' &&
                        <div className='absolute flex justify-center items-center w-full h-70 text-3xl bg-white/60'>Sold</div>
                    }
                    <img className='h-69.5' src={preview} alt={product?.name} />
                </div>

                <div className='flex mt-2.5 gap-2.5 '>
                    {
                        product?.image?.map((i, key) => (
                            <div key={key} onClick={() => setPreview(i)} className='bg-secondary border border-border hover:border-1 hover:border-primary rounded-xl cursor-pointer place-items-center w-fit h-20'>
                                <img className='h-19.5 overflow-hidden rounded-xl' src={i} alt="product" />
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-center gap-5 mt-2.5'>
                    <span className='text-[35px] text-primary font-bold'>₹ {product?.price}</span>
                    <span className='text-h3 bg-secondary text-text-dark rounded-full py-0.5 px-3'>{product?.condition}</span>
                </div>

                <div>
                    <span className='text-heading font-medium'>{product?.name}</span>
                </div>

                <div className='flex gap-2 mt-2.5'>
                    <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>{product?.category}</button>
                    <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>{calculateDistance(user?.lat, user?.lng, product?.location?.coordinates?.[1], product?.location?.coordinates?.[0])} km · {sellerLocation}</button>
                    <button className='text-h3 border border-border rounded-xl py-0.5 px-3'>Listed {getTimeLabel(product?.createdAt)}</button>
                </div>


                <div className='text-h1 mt-5'>
                    <span>{product?.description}</span>

                    <div className='flex items-center mt-5'>
                        <div className='grid gap-5 m-4 w-full'>
                            <div className='grid'>
                                <span className='text-h4 text-gray-500 font-medium'>Brand</span>
                                <span className='text-h2'>{product?.brand}</span>
                            </div>
                            <div className='grid'>
                                <span className='text-h4 text-gray-500 font-medium'>Age</span>
                                <span className='text-h2'>{product?.product_age}</span>
                            </div>
                        </div>

                        <div className='grid gap-5 m-4 w-full'>
                            <div className='grid'>
                                <span className='text-h4 text-gray-500 font-medium'>Model</span>
                                <span className='text-h2'>{product?.model}</span>
                            </div>
                            <div className='grid'>
                                <span className='text-h4 text-gray-500 font-medium'>Original price</span>
                                <span className='text-h2'>₹ {product?.original_price}</span>
                            </div>
                        </div>
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
