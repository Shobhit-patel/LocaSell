import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOpen } from '../../reducers/features/popup/editPopup'
import EditProfile from './EditProfile'
import hamburger from '../../assets/icons/hamburger.png'
import star from '../../assets/icons/star.png'
import { getSellerRatings } from '../../reducers/features/rating/ratingSlice'
import Loading from '../Loading'

const SoProfile = ({ setSidebarOpen }) => {
    const dispatch = useDispatch()

    const user = useSelector((state) => state.signup.user || state.login.user);

    const UserAvatarName = user?.firstName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('') + user?.lastName?.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('') || 'US'

    const rating = Math.round(user?.averageRating)
    let ratingArr = []
    for (let i = 0; i < rating; i++) {
        ratingArr.push(i)
    }

    const { open } = useSelector((state) => state.editPopup)
    const { ratings, loading } = useSelector((state) => state.rating)

    useEffect(() => {
        if (user?._id) {
            dispatch(getSellerRatings(user._id));
        }
    }, [dispatch, user?._id]);

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2.5 lg:gap-5'>
                    <div className='bg-secondary text-text-dark rounded-full w-20 h-20 lg:w-30 lg:h-30 pt-6 lg:pt-8  text-3xl lg:text-5xl text-center font-bold '>{UserAvatarName}</div>
                    <div>
                        <h1 className='text-h1'>{user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1)} {user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1)}</h1>
                        <h1 className='text-h1'>{user?.email}</h1>
                    </div>
                </div>

                <div className='flex items-center gap-2.5 lg:gap-5'>
                    <button onClick={() => dispatch(setOpen(true))} className='border border-border md:hidden max-sm:hidden sm:hidden lg:block  rounded-xl cursor-pointer text-h2 px-5 py-2 '>Edit profile</button>
                    <button onClick={() => dispatch(setOpen(true))} className='border border-border rounded-xl cursor-pointer lg:hidden text-h2 px-5 py-2 '>Edit</button>
                    <button className=' block lg:hidden '>
                        <img onClick={() => setSidebarOpen(true)} className='w-5 cursor-pointer dark:invert-100' src={hamburger} alt="" />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-5'>
                <div className='border border-border text-center w-full  px-5 py-2 rounded-xl'>
                    <h1 className='text-logo font-bold'>{user?.soldItem}</h1>
                    <span className='text-border text-h1'>Item sold</span>
                </div>
                <div className='border border-border text-center w-full  px-5 py-2 rounded-xl'>
                    <h1 className='text-logo font-bold'>{user?.activeItem}</h1>
                    <span className='text-border text-h1'>Active item</span>
                </div>
                <div className='border border-border text-center w-full  px-5 py-2 rounded-xl'>
                    <div className='flex justify-center items-center gap-1 '>
                        {
                            ratingArr.map((i) => (
                                <img key={i} className='w-5 h-5 ' src={star} alt="" />
                            ))
                        }
                        <h1 className='text-logo font-bold text-amber-700'>{user?.averageRating}</h1>
                    </div>
                    <span className='text-border text-h1'>Rating</span>
                </div>
                <div className='border border-border text-center w-full  px-5 py-2 rounded-xl'>
                    <h1 className='text-logo font-bold text-primary'>{user?.responsePercent} %</h1>
                    <span className='text-border text-h1'>Response Percent</span>
                </div>

                <div className='border border-border text-center w-full  px-5 py-2 rounded-xl'>
                    <h1 className='text-logo font-bold'>{user?.wishlist.length} </h1>
                    <span className='text-border text-h1'>Wishlist</span>
                </div>
                <div className='border border-border text-center w-full  px-5 py-2 rounded-xl'>
                    <h1 className='text-logo font-bold'>{user?.productListed.length} </h1>
                    <span className='text-border text-h1'>Product Listed</span>
                </div>
            </div>

            <div className="mt-5">
                <h2 className="text-heading font-semibold mb-4">
                    Reviews ({ratings?.length || 0})
                </h2>

                {loading ? (
                    <Loading />
                ) : ratings?.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5'>
                        {ratings.map((item) => (
                            <div
                                key={item._id}
                                className="border border-border rounded-xl p-4"
                            >
                                <div className="flex justify-between items-center">
                                    <div className='w-full'>
                                        <div className='flex justify-between'>
                                            <h3>
                                                {item.reviewer.firstName}{" "}
                                                {item.reviewer.lastName}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(item.rating)].map((_, index) => (
                                                <img className="w-4 h-4"
                                                    key={index}
                                                    src={star}
                                                    alt="star" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-1 text-h1 text-gray-500">
                                    {item.review}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {open && <EditProfile />}
        </>
    )
}

export default SoProfile
