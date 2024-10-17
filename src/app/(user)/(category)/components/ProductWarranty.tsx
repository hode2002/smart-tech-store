import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductWarranty = ({ warranties }: { warranties: string[] }) => {
    return (
        <div className="flex min-h-[185px] items-center justify-center rounded-lg border border-solid">
            <ul className="block md:flex flex-wrap">
                {warranties ? (
                    warranties.map((warranty, index) => {
                        return (
                            <li
                                key={index}
                                className="p-4 flex w-full md:w-[50%] items-start gap-4"
                            >
                                <ShieldCheck
                                    color="#2ac050"
                                    className="w-[40px]"
                                />
                                <p className="w-[90%]">{warranty}</p>
                            </li>
                        );
                    })
                ) : (
                    <>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 flex w-full md:w-[50%] items-start gap-4"
                            >
                                <ShieldCheck
                                    color="#2ac050"
                                    className="w-[40px]"
                                />
                                <div className="w-[90%]">
                                    <Skeleton className="h-[36px] w-[300px] rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </ul>
        </div>
    );
};

export default ProductWarranty;
