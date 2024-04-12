import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function ProductSkeletonCard() {
    return (
        <div className="my-4 max-w-[300px]">
            <div className="border-[1px] border-[#ccc] rounded-md px-2 py-3 max-w-[300px] shadow-md m-3 flex flex-col justify-between">
                <div className="mb-4 opacity-70 text-sm">
                    <Skeleton className="h-4 w-[250px]  rounded-xl" />
                </div>

                <div className="relative flex flex-col justify-center items-center gap-2">
                    <Skeleton className="h-[200px] w-[250px] rounded-xl" />

                    <div className="flex flex-col gap-2 capitalize">
                        <div className="text-center capitalize">
                            <Skeleton className="h-5 w-[250px] rounded-xl" />
                        </div>
                        <div className="flex gap-3 mt-2 justify-center items-center">
                            <Skeleton className="h-[40px] w-[250px] rounded-xl" />
                        </div>
                        <div className="flex gap-3 mt-2 justify-center items-center">
                            <Skeleton className="h-6 w-[250px] rounded-xl" />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <Skeleton className="h-[48px] w-[250px] rounded-xl" />
                </div>
            </div>
        </div>
    );
}
