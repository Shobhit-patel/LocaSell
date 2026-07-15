import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOpen } from '../../reducers/features/popup/loginPopup'
import { startChat } from '../../reducers/features/chat/chatSlice'
import { toggleCart } from '../../reducers/features/cart/cartSlice'
import { toggleWishlist } from '../../reducers/features/wishlist/wishlisSlice'
import { setOpen } from '../../reducers/features/popup/sellerPopup'
import SellerProfile from '../SellerProfile'
import { toggleListingStatus } from '../../reducers/features/listing/soOneListing'
import toast from "react-hot-toast";

const ProductSideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const seller = useSelector((state) => state.soOneListing?.soOneListingSeller)

    const SellerAvatarName = seller?.firstName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('') + seller?.lastName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('')
    const SellerAvatar = seller?.avatar

    const rating = Math.round(seller?.averageRating)
    let ratingArr = []
    for (let i = 0; i < rating; i++) {
        ratingArr.push(i)
    }

    const user = useSelector((state) => state.signup.user || state.login.user);

    const product = useSelector((state) => state.soOneListing?.soOneListingProduct)
    const [loading, setLoading] = useState(false)

    // if user not login open login if not start chat 
    const clickMessageSeller = async () => {
        if (user) {
            setLoading(true)
            if (!seller?._id || !product?._id) {
                return;
            }
            const result = await dispatch(
                startChat({
                    seller: seller._id,
                    product: product
                })
            );
            setLoading(false)
            if (result.payload) {
                navigate('/message-seller');
            }
        } else {
            dispatch(setIsOpen(true));
        }
    }

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

    const wishlist = useSelector((state) => state.wishlist.wishlist);
    const Wmessage = useSelector((state) => state.wishlist.message)

    const isWishlisted = wishlist.some((item) => {
        const id = typeof item === "object" ? item._id : item;
        return id === product?._id;
    });

    useEffect(() => {
        if (Wmessage) {
            toast.success(Wmessage);
        }
    }, [Wmessage]);

    const handleWishlistClick = () => {
        dispatch(toggleWishlist({
            productId: product?._id,
            product: product
        }));
    };

    const { message, cart } = useSelector((state) => state.cart)

    const isCarted = cart.some((item) => {
        const id = typeof item === "object" ? item._id : item;
        return id === product?._id;
    });

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);

    const handleClick = () => {
        dispatch(toggleCart({
            productId: product?._id,
            product: product
        }));
    };

    const sellerPopup = useSelector((state) => state.sellerPopup.open)

    const toggleStatus = async () => {
        try {
            await dispatch(toggleListingStatus(product?._id)).unwrap();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} />

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 z-10 w-full sm:w-95 lg:w-95 lg:h-190 md:h-full sm:h-full max-sm:h-full border-l border-border overflow-y-auto transform transition-transform duration-300 bg-white text-black dark:bg-gray-900 dark:text-white ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:static lg:z-auto lg:h-full lg:w-95 lg:translate-x-0  `}
            >

                <div className=' p-5 border-gray-400 lg:h-190 md:h-full sm:h-full max-sm:h-full overflow-y-auto scrollbar-thumb-white'>
                    <button onClick={() => setSidebarOpen(false)} className='block cursor-pointer lg:hidden mb-2.5'> ✕ </button>

                    <div className='border border-border rounded-xl p-4'>
                        <div className='flex justify-between items-center'>
                            <div className='w-12 h-12 rounded-full'>
                                {
                                    SellerAvatar === '' ?
                                        <div className='bg-secondary text-text-dark rounded-full flex justify-center items-center w-12 h-12 text-[16px] font-bold '>{SellerAvatarName}</div>
                                        :
                                        <img className=' rounded-full w-12 h-12' src={SellerAvatar} alt="" />
                                }
                            </div>
                            <div className='grid'>
                                <span className='text-[15px] font-medium'>{seller?.firstName} {seller?.lastName}</span>
                                <span className='text-h3 text-gray-500'>Member since {getTimeLabel(seller?.createdAt)}</span>
                            </div>
                            <button onClick={() => dispatch(setOpen(true))} className='text-h3 border border-border cursor-pointer rounded-md pt-1 pr-3 pb-1 pl-3'>View Profile</button>
                        </div>

                        {/* rating */}
                        <div className='flex items-center gap-1 mt-4'>
                            {
                                ratingArr.map((i) => (
                                    <img key={i} className='w-3.5' src="../../../src/assets/icons/star.png" alt="" />
                                ))
                            }
                            <span className='text-h3 font-bold text-amber-700'>{seller?.averageRating}</span>
                            <span className='text-h3 text-gray-500'>· {seller?.reviewCount} reviews</span>
                        </div>

                        {/* sold data */}
                        <div className='flex justify-around items-center mt-4 border-border'>
                            <div className='grid w-full border-t p-2 border-border text-center'>
                                <span className='text-[17px] font-bold'>{seller?.soldItem}</span>
                                <span className='text-h5 text-gray-500'>sold</span>
                            </div>
                            <div className='grid border-t p-2 border-l border-r border-border text-center w-full'>
                                <span className='text-[17px] font-bold'>{seller?.activeItem}</span>
                                <span className='text-h5 text-gray-500'>active</span>
                            </div>
                            <div className='grid w-full p-2 border-t text-center border-gray-400'>
                                <span className='text-[17px] font-bold text-primary'>{seller?.responsePercent}%</span>
                                <span className='text-h5 text-gray-500'>response</span>
                            </div>
                        </div>
                    </div>

                    {/* buttons */}
                    {
                        seller?._id !== user?._id ?
                            <div>
                                <div onClick={() => {
                                    clickMessageSeller()
                                }} className='bg-primary text-white text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-4 pt-3 pb-3'>
                                    <button className='cursor-pointer'>{loading ? 'Loading...' : 'Message seller'}</button>
                                </div>

                                <div className='border border-border text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-2 pt-3 pb-3'>
                                    <button className='cursor-pointer'>Call seller</button>
                                </div>

                                <div onClick={handleWishlistClick} className='border border-border text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-2 pt-3 pb-3'>
                                    <button className='cursor-pointer'>
                                        {isWishlisted ?
                                            'Remove from wishlist'
                                            :
                                            'Save as wishlist'

                                        }
                                    </button>
                                </div>
                                <div onClick={handleClick} className='border border-border text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-2 pt-3 pb-3'>
                                    <button className='cursor-pointer'>
                                        {isCarted ?
                                            'Remove from cart'
                                            :
                                            'Add to cart'
                                        }
                                    </button>
                                </div>
                            </div>
                            :
                            <div onClick={toggleStatus} className='border border-border text-h2 font-medium font-stretch-130% text-center rounded-xl cursor-pointer mt-2 pt-3 pb-3'>
                                <button className='cursor-pointer'>
                                    {product?.status === 'active' ? 'Mark sold' : 'Mark active'}
                                </button>
                            </div>
                    }


                    <div className='text-h3 bg-orange-100 text-orange-900 rounded-xl cursor-pointer mt-4 p-5'>
                        <p>Meet in a public place. Inspect before paying. Report suspicious listings using the flag button.</p>
                    </div>
                </div>
            </div>
            {sellerPopup && <SellerProfile seller={seller} />}
        </>
    )
}

export default ProductSideBar
