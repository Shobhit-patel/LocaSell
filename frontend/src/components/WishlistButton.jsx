import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../reducers/features/wishlist/wishlisSlice";
import loader from '../assets/icons/loader.png'
import heartA from '../assets/icons/heartA.png'
import heartNA from '../assets/icons/heartNA.png'
import { setIsOpen } from "../reducers/features/popup/loginPopup";

const WishlistButton = ({ product }) => {
    const dispatch = useDispatch();
    const productId = product?._id;

    const token = localStorage.getItem("token");

    const { wishlist, loading, loadingProductId } = useSelector((state) => state.wishlist);
    const isLoading = loading && loadingProductId === productId;

    const isWishlisted = wishlist.some((item) => {
        const id = typeof item === "object" ? item._id : item;
        return id === productId;
    });

    const handleClick = () => {
        dispatch(toggleWishlist({
            productId,
            product
        }));
        if (!token) {
            dispatch(setIsOpen(true));
        }
    };

    return (
        <button className='cursor-pointer bg-white border border-border rounded-full p-1.5' onClick={handleClick}>
            {isWishlisted ? (
                isLoading ? (
                    <img className="w-5.5 animate-spin" src={loader} alt="" />
                ) : (
                    <img className="w-5.5" src={heartA} alt="" />
                )
            ) : (
                isLoading ? (
                    <img className="w-5.5 animate-spin" src={loader} alt="" />
                ) : (
                    <img className="w-5.5" src={heartNA} alt="" />
                )
            )}
        </button>
    );
};

export default WishlistButton;