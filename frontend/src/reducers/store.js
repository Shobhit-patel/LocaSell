import { configureStore } from '@reduxjs/toolkit'
import locationReducer from './features/locationSlice'
import uploadedReducer from './features/uploadedProdSlice'
import productUserReducer from './features/productUserSlice'
import imagePopupReducer from './features/imagePopupSlice'

// auth
import signupReducer from "./features/auth/signup";
import loginReducer from "./features/auth/login";

// popup 
import signupPopupReducer from './features/popup/signupPopup'
import loginPopupReducer from './features/popup/loginPopup'
import mapPopupReducer from './features/popup/mapPopup'
import sellerPopupReducer from './features/popup/sellerPopup'
import editPopupReducer from './features/popup/editPopup'

//profile
import profileReducer from './features/active/profile'

//listing
import listingReducer from './features/listing/listing'
import soListingReducer from './features/listing/soListing'
import soOneListingReducer from './features/listing/soOneListing'

// location
import locationCoordinatesReducer from './features/location/locationCoordinates'

//wishlist
import wishlistReducer from './features/wishlist/wishlisSlice'

//cart
import cartReducer from './features/cart/cartSlice'

//chat
import chatReducer from './features/chat/chatSlice'

//theme
import themeReducer from './features/theme/themeSlice'

//notification
import notificationReducer from './features/notification/notificationSlice'

// rating
import ratingReducer from './features/rating/ratingSlice'


export const store = configureStore({
    reducer: {
        location: locationReducer,
        uploaded: uploadedReducer,
        mapPopup: mapPopupReducer,
        productUser: productUserReducer,
        signup: signupReducer,
        login: loginReducer,
        imagePopup: imagePopupReducer,
        signupPopup: signupPopupReducer,
        loginPopup: loginPopupReducer,
        editPopup: editPopupReducer,
        profile: profileReducer,
        listing: listingReducer,
        soListing: soListingReducer,
        soOneListing: soOneListingReducer,
        locationCoordinates: locationCoordinatesReducer,
        chat: chatReducer,
        wishlist: wishlistReducer,
        cart: cartReducer,
        theme: themeReducer,
        notification: notificationReducer,
        sellerPopup:sellerPopupReducer,
        rating: ratingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

})