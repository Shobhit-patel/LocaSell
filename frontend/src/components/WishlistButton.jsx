import { useDispatch, useSelector } from "react-redux";
import { clearMessage, toggleWishlist } from "../reducers/features/wishlist/wishlisSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

const WishlistButton = ({ product }) => {
    const dispatch = useDispatch();
    const productId = product?._id;

    const { wishlist, message, loading, loadingProductId } = useSelector((state) => state.wishlist);
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
    };

    useEffect(() => {
        if (!message) return;

        toast.success(message, { id: "wishlist-toast", });

        dispatch(clearMessage());
    }, [message, dispatch]);

    return (
        <button className='cursor-pointer absolute bg-white border border-border rounded-full p-1.5 right-5 -top-36' onClick={handleClick}>
            {isWishlisted ? (
                isLoading ? (
                    <img className="w-5.5 animate-spin" src="../../../src/assets/icons/loader.png" alt="" />
                ) : (
                    <img className="w-5.5" src="../../../src/assets/icons/heartA.png" alt="" />
                )
            ) : (
                isLoading ? (
                    <img className="w-5.5 animate-spin" src="../../../src/assets/icons/loader.png" alt="" />
                ) : (
                    <img className="w-5.5" src="../../../src/assets/icons/heartNA.png" alt="" />
                )
            )}
        </button>
    );
};

export default WishlistButton;