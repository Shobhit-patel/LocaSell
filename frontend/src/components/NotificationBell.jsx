import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { clearNotifications, markNotificationsAsRead } from '../reducers/features/notification/notificationSlice';
import bell from '../assets/icons/bell.png'

const NotificationBell = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const user = useSelector((state) => state.signup.user || state.login.user);

    const { items } = useSelector((state) => state.notification);

    const handleNotification = useCallback(() => {
        navigate('/message-seller')
        if (user?._id) {
            dispatch(markNotificationsAsRead(user._id));
        }
        dispatch(clearNotifications())
    }, [dispatch, navigate, user]);

    return (
        <>
            <div className="relative cursor-pointer"  >
                <div className='w-10 relative p-2'>
                    <img onClick={handleNotification} className='w-5 cursor-pointer dark:invert-100' src={bell} alt="" />
                </div>
                {items?.length > 0 && (
                    <span onClick={handleNotification} className='absolute right-1 text-white text-h3 text-center -top-1 w-5 h-5 bg-primary rounded-full cursor-pointer '>
                        {items?.length}
                    </span>
                )}
            </div>
        </>
    )
}

export default NotificationBell
