import { Button } from '@/components/ui/button';
import { ProductDescriptionType } from '@/schemaValidations/product.schema';
import React, { useState } from 'react';

const ProductDescription = ({
    descriptions,
}: {
    descriptions: ProductDescriptionType[];
}) => {
    const [isShowMore, setIsShowMore] = useState<boolean>(false);

    return (
        <div className="mt-8 w-full flex flex-col items-center relative">
            <p className="self-start text-[20px] font-bold">
                Thông tin sản phẩm
            </p>
            <div
                className={`py-4 min-h-[400px] ${isShowMore ? 'animate-fade-down' : 'max-h-[50vh] overflow-hidden'}`}
                dangerouslySetInnerHTML={
                    descriptions && {
                        __html: descriptions[0].content,
                    }
                }
            ></div>
            {!isShowMore && (
                <div
                    className="bottom-4 h-32 left-0 absolute w-full"
                    style={{
                        background:
                            'linear-gradient(to bottom,rgba(255 255 255/0),rgba(255 255 255/62.5),rgba(255 255 255/1))',
                    }}
                ></div>
            )}
            <Button
                className="w-max mt-4 z-30"
                onClick={() => setIsShowMore(!isShowMore)}
            >
                {isShowMore ? 'Thu gọn' : 'Xem thêm'}
            </Button>
        </div>
    );
};

export default ProductDescription;
