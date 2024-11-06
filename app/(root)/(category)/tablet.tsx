import { Button } from '@/components/Button';
import CategoryProductList from '@/components/cate-product-list';
import { CheckboxMultiple } from '@/components/checkbox-mutiple';
import { icons } from '@/constants';
import brandApiRequest from '@/lib/apiRequest/brand';
import productApiRequest, { ProductType } from '@/lib/apiRequest/product';
import { BrandResponseType, BrandType } from '@/schemaValidations/brand.schema';
import {
    GetProductsResponseType,
    ProductFilter,
    ProductFilterType,
} from '@/schemaValidations/product.schema';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type FilterFieldType = { id: string; label: string };

const Tablet = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<BrandType[]>([]);
    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        productApiRequest
            .getProductsByCategory('tablet')
            .then((response: GetProductsResponseType) => {
                setProducts(response.data);
            });
        brandApiRequest
            .getByCategoryName('tablet')
            .then((res: BrandResponseType) => setBrands(res.data));
    }, []);

    const brandsFilter: FilterFieldType[] = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            ...brands
                .map((brand) => ({ id: brand.slug, label: brand.name }))
                .reverse(),
        ],
        [brands],
    );
    const prices: FilterFieldType[] = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: 'pt=3',
                label: 'Dưới 3 triệu',
            },
            {
                id: 'pf=3&pt=8',
                label: 'Từ 3 - 8 triệu',
            },
            {
                id: 'pf=8&pt=15',
                label: 'Từ 8 - 15 triệu',
            },
            {
                id: 'pf=15',
                label: 'Trên 15 triệu',
            },
        ],
        [],
    );
    const rams: FilterFieldType[] = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '4gb',
                label: '4 GB',
            },
            {
                id: '6gb',
                label: '6 GB',
            },
            {
                id: '8gb',
                label: '8 GB',
            },
            {
                id: '12gb',
                label: '12 GB',
            },
        ],
        [],
    );
    const roms: FilterFieldType[] = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '32gb',
                label: '32 GB',
            },
            {
                id: '64gb',
                label: '64 GB',
            },
            {
                id: '128gb',
                label: '128 GB',
            },
            {
                id: '256gb',
                label: '256 GB',
            },
            {
                id: '512gb',
                label: '512 GB',
            },
        ],
        [],
    );
    const productFilterBox = useMemo<
        {
            name: string;
            label: string;
            items: FilterFieldType[];
        }[]
    >(
        () => [
            {
                name: 'brands',
                label: 'Hãng sản xuất',
                items: brandsFilter,
            },
            {
                name: 'prices',
                label: 'Mức giá',
                items: prices,
            },
            {
                name: 'rams',
                label: 'RAM',
                items: rams,
            },
            {
                name: 'roms',
                label: 'Dung lượng lưu trữ',
                items: roms,
            },
        ],
        [brandsFilter, prices, rams, roms],
    );

    const form = useForm<ProductFilterType>({
        resolver: zodResolver(ProductFilter),
        defaultValues: {
            brands: ['all'],
            prices: ['all'],
            rams: ['all'],
            roms: ['all'],
        },
    });

    const handleFilterProduct = async () => {
        const filterDataObj = form.getValues();
        const keys = Object.keys(filterDataObj);

        keys.forEach((key: string) => {
            let values = filterDataObj[key as keyof typeof filterDataObj];
            const target = values[values.length - 1] ?? 'all';
            if (target !== 'all') {
                if (key === 'prices') {
                    values = [target];
                } else {
                    values = values.filter((value) => value !== 'all');
                }
            } else {
                values = ['all'];
            }
            form.setValue(key as keyof typeof filterDataObj, values);
        });

        const response = (await productApiRequest.getProductsByUserFilter(
            'tablet',
            form.getValues(),
        )) as GetProductsResponseType;

        if (response?.statusCode === 200) {
            setProducts(response.data);
        }
    };

    const filterBy = (): string => {
        return Object.values(form.getValues())
            .reduce((items: string[], values: any) => {
                if (!values.includes('all')) {
                    const hasPriceFilter = values.some(
                        (v: string) => v.includes('pf') || v.includes('pt'),
                    );

                    if (hasPriceFilter) {
                        prices.forEach((p) => {
                            if (values.includes(p.id)) {
                                items.push(p.label);
                            }
                        });
                    } else {
                        items.push(...values);
                    }
                }
                return items;
            }, [])
            .join(',');
    };

    const handleClearFilter = () => {
        form.reset();
        productApiRequest
            .getProductsByCategory('tablet')
            .then((response: GetProductsResponseType) => {
                setProducts(response.data);
            });
    };

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    return (
        <GestureHandlerRootView>
            <ScrollView className="w-full bg-white">
                <View className="w-full py-3">
                    <View className="flex gap-2 items-center">
                        <Text className="font-bold text-[28px] pb-2">
                            Máy tính bảng
                        </Text>
                        <Text className="opacity-90 font-semibold text-md">
                            ({products?.length ?? 0} sản phẩm)
                        </Text>
                    </View>
                </View>
                <View>
                    <View className="flex-col-reverse justify-between gap-4">
                        <View className="flex-row flex-wrap gap-2 mx-3">
                            {Object.values(form.getValues()).some(
                                (v) => !v.includes('all'),
                            ) && (
                                <View className="flex-row items-center gap-2">
                                    <Text>Lọc theo:</Text>
                                    <Text className="font-bold capitalize">
                                        {filterBy()}
                                    </Text>
                                    <Button
                                        onPress={handleClearFilter}
                                        label="Xóa tất cả"
                                        variant={'link'}
                                        labelClasses="font-JakartaBold text-red-500"
                                        className="rounded-md"
                                    />
                                </View>
                            )}
                        </View>
                        <Text className="flex-row items-center mx-3">
                            <Button
                                onPress={handleOpenBottomSheet}
                                label="Bộ lọc"
                                labelClasses="font-JakartaBold text-black"
                                className="mb-20 mx-4 font-JakartaBold min-w-[100px] rounded-md border"
                            />
                        </Text>
                    </View>
                    <CategoryProductList products={products} />
                </View>
            </ScrollView>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['100%', '100%']}
            >
                <BottomSheetScrollView
                    style={{
                        flex: 1,
                        padding: 20,
                    }}
                >
                    <View className="flex-row gap-2 mb-4">
                        <Image
                            source={icons.listFilter}
                            resizeMode="contain"
                            className="w-8 h-8"
                        />
                        <Text className="font-JakartaExtraBold">
                            Bộ lọc tìm kiếm
                        </Text>
                    </View>
                    <CheckboxMultiple
                        form={form}
                        handleFilterProduct={handleFilterProduct}
                        productFilterBox={productFilterBox}
                    />
                </BottomSheetScrollView>
                <Button
                    onPress={() => {
                        bottomSheetRef.current?.close();
                    }}
                    label={`Lọc (${products.length > 0 ? products.length : 0} sản phẩm) `}
                    labelClasses="font-JakartaBold text-white"
                    className="my-4 mx-4 font-JakartaBold bg-black min-w-[120px] rounded-md"
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default Tablet;
