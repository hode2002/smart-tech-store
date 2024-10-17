import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Image from 'next/image';

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    ProductDetailType,
    ProductOptionType,
    ProductPaginationResponseType,
} from '@/schemaValidations/product.schema';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import productApiRequest from '@/apiRequests/product';
import { debounce } from 'lodash';

type Props = {
    setItems: Dispatch<SetStateAction<any>>;
    mainProductId?: string;
    disabled?: boolean;
};
const SearchProduct = (props: Props) => {
    const { setItems, mainProductId = '', disabled = false } = props;
    const [products, setProducts] = useState<ProductDetailType[]>([]);

    const [searchTerm, setSearchTerm] = useState<string>('');

    const getProducts = useCallback(
        async (keyword: string) => {
            (async () => {
                const response: ProductPaginationResponseType =
                    await productApiRequest.getProductsByKeyword(keyword);
                setProducts(response.data.products);
            })();
        },
        [setProducts],
    );

    //eslint-disable-next-line
    const debouncedSearch = useCallback(
        debounce((query) => {
            getProducts(query);
        }, 500),
        [],
    );

    const handleOnChange = (keyword: string) => {
        setSearchTerm(keyword);
        if (keyword) {
            debouncedSearch(keyword);
        }
    };

    const clearSearch = () => {
        setProducts([]);
        setSearchTerm('');
    };

    const handleSetItems = (el: ProductOptionType) => {
        if (mainProductId?.length > 0) {
            setItems((prev: ProductOptionType[]) => [...prev, el]);
        } else {
            setItems(el);
        }
        clearSearch();
    };

    return (
        <Command className="rounded-lg border shadow-md">
            <div className="flex items-center border-b px-3">
                <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                    disabled={disabled}
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => handleOnChange(e.target.value)}
                    className="focus-visible:ring-0 border-none p-0"
                />
            </div>
            <CommandList>
                <CommandGroup>
                    {products &&
                        products.length > 0 &&
                        products.flatMap((item) =>
                            item.product_options
                                .filter((i) => i.id !== mainProductId)
                                .map((el) => (
                                    <CommandItem
                                        key={el.id}
                                        value={el.id}
                                        onSelect={() => handleSetItems(el)}
                                        className="flex gap-2 items-center"
                                    >
                                        <Image
                                            src={el.thumbnail}
                                            width={50}
                                            height={50}
                                            alt={el.slug}
                                        />
                                        <p>
                                            {item.name +
                                                ' ' +
                                                el.sku.replaceAll('-', ' ')}
                                        </p>
                                    </CommandItem>
                                )),
                        )}
                </CommandGroup>
            </CommandList>
        </Command>
    );
};

export default SearchProduct;
