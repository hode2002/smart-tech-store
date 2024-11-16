import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function ProductSkeletonCard() {
    return (
        <div className="my-4 mx-2 lg:mx-0 w-[175px] lg:w-auto lg:max-w-[300px]">
            <div className="border-[1px] border-[#ccc] rounded-lg p-3 w-[175px] lg:w-auto lg:max-w-[300px] shadow-lg mx-0 lg:m-3 flex flex-col justify-between">
                <div className="mb-4 opacity-70 text-sm">
                    <Skeleton className="h-4 w-full lg:w-[250px] rounded-xl" />
                </div>

                <div className="relative flex flex-col justify-center items-center gap-2">
                    <Skeleton className="h-[200px] w-full lg:w-[250px] rounded-xl" />

                    <div className="flex flex-col gap-2 capitalize">
                        <div className="flex gap-3 mt-2 justify-center items-center">
                            <Skeleton className="h-[40px] w-[175px] lg:w-[250px] rounded-xl" />
                        </div>
                        <div className="flex gap-3 mt-2 justify-center items-center">
                            <Skeleton className="h-6 w-[175px] lg:w-[250px] rounded-xl" />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <Skeleton className="h-[48px] w-full lg:w-[250px] rounded-xl" />
                </div>
            </div>
        </div>
    );
}
