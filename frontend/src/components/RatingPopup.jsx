import React, { useState } from "react";
import close from "../assets/icons/close.png";
import { setRatingOpen } from "../reducers/features/popup/ratingPopup";
import { submitRating } from "../reducers/features/rating/ratingSlice";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const RatingPopup = ({ sellerId }) => {
    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (review === '') {
            toast.error("Please give review to user");
            return;
        }

        dispatch(submitRating({
            sellerId,
            rating,
            review,
        }));

        toast.success("Thank you for your review!");
        dispatch(setRatingOpen(false));
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-10" onClick={() => dispatch(setRatingOpen(false))} >
            <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 text-black dark:text-white relative flex flex-col justify-center w-140 h-auto mx-4 px-5 py-5 text-left text-sm rounded-xl"  >

                <div onClick={() => dispatch(setRatingOpen(false))} className="absolute right-5 top-5 bg-secondary p-2 rounded-full cursor-pointer" >
                    <img className="w-3" src={close} alt="Close" />
                </div>

                <div className="flex flex-col items-center mt-6 mb-5">
                    <h1 className="text-heading font-bold">Your Rating</h1>

                    <div className="flex items-center gap-2.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={30}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className={`cursor-pointer transition-all duration-200 ${star <= (hover || rating)
                                    ? "text-yellow-400 scale-110"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid mb-5">
                    <span className="text-gray-600 dark:text-gray-300">
                        Your Review
                    </span>

                    <textarea className="text-h2 border border-border outline-0 rounded-xl resize-none h-20 mt-1 pt-2 pb-2 pl-3"
                        placeholder="Share your experience with this seller..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit} className="bg-primary w-full text-white text-h2 font-medium rounded-xl cursor-pointer py-3 mb-4">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default RatingPopup;