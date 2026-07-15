import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitRating } from "../reducers/features/rating/ratingSlice";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const Rating = ({ sellerId }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleRating = (value) => {
        setRating(value);
        toast.success('Thank you for rating user')
        dispatch(
            submitRating({
                sellerId,
                rating: value,
                review: "",
            })
        );
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={30} onClick={() => handleRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className={`w-7 cursor-pointer transition-all duration-200 ${star <= (hover || rating)
                    ? "text-yellow-400 scale-110"
                    : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    );
};

export default Rating;