import { RatingType } from '@/schemaValidations/product.schema';
import { Rating } from '@material-tailwind/react';
import React from 'react';

const ProductRating = ({ rating }: { rating: RatingType }) => {
    return (
        <>
            <div className="flex gap-2">
                <p className="font-bold text-lg align-bottom">
                    {rating?.overall}
                </p>
                <Rating value={Math.floor(rating.overall)} readonly />
                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                    ({rating?.total_reviews})
                </p>
            </div>

            <ul className="mt-8">
                {rating?.total_reviews &&
                    rating.details
                        .map((star, index) => {
                            if (index === 0) return;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center mt-4"
                                >
                                    <span className="font-medium flex gap-1 items-center">
                                        {index}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4 text-[#fbc02d] cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                        <div
                                            className={`h-2 bg-[#fbc02d] rounded ${star === 0 ? 'w-0' : `w-[${Number(star / rating.total_reviews) * 100}%]`}`}
                                        ></div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <span>
                                            {Number(
                                                star / rating.total_reviews,
                                            ) * 100}
                                        </span>
                                        <span>%</span>
                                    </p>
                                </div>
                            );
                        })
                        .reverse()}
            </ul>
        </>
    );
};

export default ProductRating;
