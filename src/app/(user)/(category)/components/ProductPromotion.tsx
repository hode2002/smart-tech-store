import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductPromotion = ({ promotions }: { promotions: string[] }) => {
    return (
        <div>
            <p className="border border-solid p-2 rounded-t-lg">Khuyến mãi</p>
            <ul className="border border-solid rounded-b-lg">
                {promotions ? (
                    promotions.map((promotion, index) => (
                        <li key={index} className="p-4 flex items-start gap-4">
                            <BadgeCheck color="#2ac050" className="w-[40px]" />
                            <p className="text-sm w-[90%]">{promotion}</p>
                        </li>
                    ))
                ) : (
                    <>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 flex items-start gap-4"
                            >
                                <BadgeCheck
                                    color="#2ac050"
                                    className="w-[40px]"
                                />
                                <div className="w-[90%]">
                                    <Skeleton className="h-[36px] w-[400px] rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </ul>
        </div>
    );
};

export default ProductPromotion;
