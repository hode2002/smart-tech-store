import accountApiRequest from '@/apiRequests/account';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
    HistorySearchItem,
    ProductType,
    removeHistorySearch,
    removeLocalSearch,
} from '@/lib/store/slices';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

type Props = {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    searchList: HistorySearchItem[];
    searchSuggestions: ProductType[];
    setSearchSuggestions: Dispatch<SetStateAction<ProductType[]>>;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function HeaderSearchList(props: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {
        searchTerm,
        setSearchTerm,
        searchList,
        searchSuggestions,
        setSearchSuggestions,
        isOpen,
        setIsOpen,
    } = props;
    const token = useAppSelector((state) => state.auth.accessToken);

    const handleClick = (searchItem?: HistorySearchItem) => {
        setIsOpen(false);
        setSearchSuggestions([]);
        if (searchItem) {
            router.push(
                `/search?keywords=${searchItem.search_content.replaceAll(' ', '+')}`,
            );
        }
    };

    const handleDeleteSearchItem = async (searchItem: HistorySearchItem) => {
        if (token) {
            await accountApiRequest.removeHistorySearch(token, searchItem);
            dispatch(removeHistorySearch(searchItem));
        } else {
            dispatch(removeLocalSearch(searchItem));
        }
    };

    return (
        isOpen &&
        (searchTerm ? (
            <div
                className={`rounded-md bg-popover z-50 mt-1 absolute w-full min-h-fit shadow-lg`}
            >
                <>
                    <div className="p-2 bg-blue-gray-50">Sản phẩm gợi ý</div>
                    {searchSuggestions && searchSuggestions?.length > 0 ? (
                        <div className="left-0 p-4">
                            <ScrollArea className="">
                                {searchSuggestions
                                    .slice(0, 5)
                                    .reverse()
                                    .map((item) => {
                                        const selectedOption =
                                            item.product_options[0];
                                        // item.product_options.find(
                                        //     (productOption) =>
                                        //         productOption.is_sale &&
                                        //         productOption.discount > 0,
                                        // );

                                        const productName =
                                            item.name +
                                            ' ' +
                                            selectedOption.sku.replaceAll(
                                                '-',
                                                ' ',
                                            );
                                        const price = formatPrice(
                                            Number(
                                                item.price +
                                                    selectedOption.price_modifier,
                                            ),
                                        );

                                        const salePrice = formatPrice(
                                            Number(
                                                item.price -
                                                    (item.price *
                                                        selectedOption.discount) /
                                                        100 +
                                                    selectedOption.price_modifier,
                                            ),
                                        );

                                        return (
                                            <Link
                                                key={selectedOption.id}
                                                href={
                                                    '/' +
                                                    item.category.slug +
                                                    '/' +
                                                    selectedOption.slug
                                                }
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsOpen(false);
                                                    setSearchSuggestions([]);
                                                    setSearchTerm('');
                                                }}
                                                className={
                                                    'block space-y-1 rounded-md p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                                }
                                            >
                                                <div className="flex gap-3 items-center capitalize">
                                                    <Image
                                                        src={
                                                            selectedOption.thumbnail
                                                        }
                                                        width={70}
                                                        height={70}
                                                        alt={
                                                            item.name +
                                                            ' ' +
                                                            selectedOption.sku.replaceAll(
                                                                '-',
                                                                ' ',
                                                            )
                                                        }
                                                    />
                                                    <div className="items-start">
                                                        <p className="font-bold text-md leading-none">
                                                            {productName}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <p className="mt-4 flex gap-2 font-semibold">
                                                                <span className="text-[#d0021c]">
                                                                    {selectedOption.discount >
                                                                    0
                                                                        ? salePrice
                                                                        : price}
                                                                </span>
                                                            </p>
                                                            {selectedOption.discount >
                                                                0 && (
                                                                <p className="mt-4 flex gap-2 font-semibold">
                                                                    <span className="line-through">
                                                                        {price}
                                                                    </span>
                                                                    <span>
                                                                        {' '}
                                                                        {
                                                                            -selectedOption.discount
                                                                        }
                                                                        %
                                                                    </span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="flex text-[14px] md:text-[16px] px-4 py-2 justify-between items-center w-full hover:cursor-pointer hover:bg-popover-foreground hover:text-popover">
                            <div
                                onMouseDown={(e) => e.stopPropagation()}
                                className="truncate"
                            >
                                Không tìm thấy sản phẩm phù hợp
                            </div>
                        </div>
                    )}
                </>
            </div>
        ) : (
            <div
                onMouseDown={() => setIsOpen(false)}
                className={`rounded-md bg-popover z-50 mt-1 absolute w-full min-h-fit shadow-lg`}
            >
                {searchList && searchList.length > 0 && (
                    <>
                        <div className="p-2 bg-blue-gray-50">
                            Tìm kiếm gần đây của bạn
                        </div>
                        {searchList
                            ?.slice(0, 5)
                            .reverse()
                            .map((searchItem: HistorySearchItem) => (
                                <div
                                    key={searchItem.id}
                                    className="flex text-[14px] md:text-[16px] px-4 py-2 justify-between items-center w-full hover:cursor-pointer hover:bg-popover-foreground hover:text-popover"
                                >
                                    <div
                                        className="truncate"
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleClick(searchItem);
                                        }}
                                    >
                                        {searchItem?.search_content}
                                    </div>
                                    <p
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSearchItem(searchItem);
                                        }}
                                    >
                                        <X />
                                    </p>
                                </div>
                            ))}
                    </>
                )}
            </div>
        ))
    );
}
