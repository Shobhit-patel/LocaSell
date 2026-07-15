import React, { useEffect } from 'react'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import PostPage from './pages/PostPage'
import Navbar from './components/Navbar'
import ProductDetails from './pages/ProductDetails'
import MessagePage from './pages/MessagePage'
import Profile from './pages/Profile'
import { useDispatch, useSelector } from 'react-redux'
import { submitLoginData } from './reducers/features/auth/login'
import { getLocation, getPopUpLocation } from './reducers/features/location/locationCoordinates'
import { getLocationName } from './reducers/features/locationSlice'
import { getWishlist } from './reducers/features/wishlist/wishlisSlice'
import { getCart } from './reducers/features/cart/cartSlice'
import SocketListener from './components/SocketListener'
import { fetchNotifications } from './reducers/features/notification/notificationSlice'
import { Toaster } from 'react-hot-toast'


const App = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(submitLoginData())
    }
  }, [])

  const user = useSelector((state) => state.signup.user || state.login.user);

  useEffect(() => {
    if (user?.location?.coordinates) {
      dispatch(getLocation({
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      }));
      dispatch(getPopUpLocation({
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      }));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user?.location?.coordinates[1] || !user?.location?.coordinates[0]) return;

    const fetchName = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${user?.location?.coordinates[1]}&lon=${user?.location?.coordinates[0]}&format=json`
      );

      const data = await res.json();
      dispatch(getLocationName(data.display_name));
    };
    fetchName();
  }, [user, dispatch]);


  //getWishlist
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getWishlist());
    }
  }, [user]);

  //getCart
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getCart());
    }
  }, [user]);


  //theme
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  //notification
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications(user?._id));
    }
  }, [user?._id, dispatch]);


  return (
    <div className='w-full max-w-[90rem] mx-auto h-screen overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'>
      <Toaster position='top-right' />
      <SocketListener />
      {location?.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/post-item' element={<PostPage />} />
        <Route path='/product-details' element={<ProductDetails />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path='/message-seller' element={<MessagePage />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
