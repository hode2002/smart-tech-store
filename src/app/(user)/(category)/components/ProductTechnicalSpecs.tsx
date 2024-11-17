import React from 'react';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import { Skeleton } from '@/components/ui/skeleton';

const ProductTechnicalSpecs = ({
    convertProductName,
    technicalSpecs,
}: {
    convertProductName: () => string;
    technicalSpecs: TechnicalSpecsItem[];
}) => {
    return (
        <div className="mt-8">
            <div className="flex text-nowrap gap-2 items-center font-bold text-[20px] capitalize">
                <span className="text-nowrap">Cấu hình</span>{' '}
                {technicalSpecs ? (
                    <p className="truncate">{convertProductName()}</p>
                ) : (
                    <Skeleton className="h-[24px] w-full rounded-lg" />
                )}
            </div>
            <ul className="border border-solid mt-2 rounded-lg">
                {technicalSpecs &&
                    technicalSpecs
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item, index) => (
                            <li
                                key={index}
                                className="px-2 py-3 flex border-b text-[14px] capitalize"
                            >
                                <p className="w-[45%]">{item.name}:</p>
                                <div className="px-2 w-[calc(50%)]">
                                    <span>{item.value}</span>
                                </div>
                            </li>
                        ))}
            </ul>
        </div>
    );
};

export default ProductTechnicalSpecs;
