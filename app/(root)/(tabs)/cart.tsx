import React, {
    useEffect,
    useState,
    useMemo,
    useRef,
    useCallback,
} from 'react';
import {
    Alert,
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { formatPrice } from '@/lib/utils';
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useAuthStore, useUserStore } from '@/store';
import { CartTableColumn, ProductCheckout, ProductOption } from '@/types/type';
import { Href, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Checkbox, ChevronDownIcon } from 'native-base';
import accountApiRequest, {
    AddToCartResponseType,
    ChangeProductOptionResponseType,
    RemoveCartProductResponseType,
} from '@/lib/apiRequest/account';
import { Button } from '@/components/Button';
import { icons } from '@/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import SwipeToDeleteCartItem from '@/components/SwipeToDeleteCartItem';

export default function CartTable() {
    const { accessToken } = useAuthStore((state) => state);
    const {
        profile: userProfile,
        address: userAddress,
        cart: cartProducts,
        setCartProducts,
        setProductCheckout,
        removeCartItem,
    } = useUserStore((state) => state);

    const [loading, setLoading] = useState(false);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const data: CartTableColumn[] = useMemo(
        () =>
            cartProducts.map((cartItem) => {
                const selectedOption = cartItem.selected_option;
                return {
                    id: cartItem.id,
                    product: {
                        thumbnail: selectedOption.thumbnail,
                        name:
                            cartItem.name +
                            ' ' +
                            selectedOption.sku.replaceAll('-', ' '),
                    },
                    quantity:
                        cartItem.quantity < selectedOption.stock
                            ? cartItem.quantity
                            : selectedOption.stock,
                    unitPrice: cartItem.price,
                    total:
                        cartItem.quantity *
                        (cartItem.price +
                            selectedOption.price_modifier -
                            ((cartItem.price + selectedOption.price_modifier) *
                                selectedOption.discount) /
                                100),
                    selectedOption,
                    otherOptions: cartItem.other_product_options,
                };
            }),
        [cartProducts],
    );

    const columns: ColumnDef<CartTableColumn>[] = [
        {
            id: 'select',
            cell: ({ row }) => (
                <Checkbox
                    value=""
                    colorScheme="red"
                    className="left-0 top-8 rounded-full"
                    isChecked={row.getIsSelected() ? true : false}
                    onChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'product',
            cell: ({ row }) => {
                const product = row.getValue<{
                    thumbnail: string;
                    name: string;
                }>('product');
                return (
                    <View className="flex-row w-11/12 items-start gap-2">
                        <Image
                            source={{ uri: product.thumbnail }}
                            alt={product.name}
                            width={80}
                            height={80}
                        />
                        <View className="w-[75%]">
                            <Text className="font-JakartaBold flex-wrap w-11/12">
                                {product.name}
                            </Text>
                        </View>
                    </View>
                );
            },
        },
        {
            id: 'otherOptions',
            accessorKey: 'otherOptions',
            cell: ({ row }) => {
                const currOption = row.original?.selectedOption;
                const otherOptions =
                    row.getValue<ProductOption[]>('otherOptions');
                const handleOpenBottomSheet = () => {
                    bottomSheetRef.current?.expand();
                    setSelectedOption(currOption);
                    setCurrentOption(currOption);
                    setOtherOptions([currOption, ...otherOptions]);
                };
                return (
                    <View>
                        <View className="w-[55%] left-[88px] flex-col top-[-50px]">
                            <TouchableOpacity onPress={handleOpenBottomSheet}>
                                <Text>
                                    <View className="w-[55%] flex-row bg-[#f1f1f1] border border-gray-200">
                                        <Text className="text-sm font-JakartaMedium mx-2 py-1">
                                            {currOption?.sku} (
                                            {currOption?.stock})
                                        </Text>
                                        <View className="py-1">
                                            <ChevronDownIcon />
                                        </View>
                                    </View>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            },
        },
        {
            accessorKey: 'unitPrice',
            cell: ({ row }) => {
                const selectedOption = row.original?.selectedOption;
                const unitPrice = parseFloat(row.getValue('unitPrice'));
                const priceModifier =
                    unitPrice +
                    selectedOption.price_modifier -
                    ((unitPrice + selectedOption.price_modifier) *
                        selectedOption.discount) /
                        100;
                return (
                    <View className="z-10 absolute w-[55%] left-[88px] flex-col top-[-10px] ml-2">
                        <View className="text-center mt-2">
                            <Text className="font-JakartaBold text-lg text-red-500">
                                {formatPrice(priceModifier)}
                            </Text>
                        </View>
                        {selectedOption.discount !== 0 && (
                            <View className="flex-row gap-2 text-center">
                                <Text className="line-through text-sm font-JakartaMedium text-gray-400">
                                    {formatPrice(
                                        unitPrice +
                                            selectedOption.price_modifier,
                                    )}
                                </Text>
                                <Text className="font-JakartaMedium text-sm">
                                    -{selectedOption.discount} %
                                </Text>
                            </View>
                        )}
                    </View>
                );
            },
        },
        {
            accessorKey: 'quantity',
            cell: ({ row }) => {
                const productOption = row.original?.selectedOption;
                const unitPrice = row.original.unitPrice;
                const quantity = row.getValue<number>('quantity');
                const productId = row.original.id;

                const handleUpdateQuantity = async (
                    type: 'DECREASE' | 'INCREASE',
                ) => {
                    let newQuantity = quantity;
                    if (type === 'DECREASE') {
                        if (newQuantity - 1 < 1) {
                            Alert.alert(
                                'Xóa sản phẩm?',
                                `Chắc chắn xóa "${row.original.product.name}" khỏi giỏ hàng`,
                                [
                                    {
                                        text: 'Hủy',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Xác nhận',
                                        onPress: () => {
                                            const productOptionId =
                                                row.original.selectedOption.id;
                                            (async () => {
                                                const response =
                                                    (await accountApiRequest.removeProductFromCart(
                                                        accessToken,
                                                        {
                                                            productOptionId,
                                                        },
                                                    )) as RemoveCartProductResponseType;
                                                if (
                                                    response.statusCode === 200
                                                ) {
                                                    Toast.show({
                                                        text1: 'Xóa thành công',
                                                    });
                                                    removeCartItem(productId);
                                                }
                                            })();
                                        },
                                    },
                                ],
                            );
                            return;
                        } else {
                            newQuantity--;
                        }
                    } else if (type === 'INCREASE') {
                        if (newQuantity + 1 > productOption.stock) {
                            Toast.show({ text1: 'Không đủ số lượng.' });
                            return;
                        }
                        newQuantity++;
                    }
                    const response =
                        (await accountApiRequest.updateProductQuantityFromCart(
                            accessToken,
                            {
                                productOptionId: productOption.id,
                                quantity: newQuantity,
                            },
                        )) as AddToCartResponseType;
                    if (response.statusCode === 200) {
                        const cartItems = cartProducts.filter(
                            (p) =>
                                p.selected_option.id !==
                                response.data.selected_option.id,
                        );
                        setCartProducts([...cartItems, response.data]);
                        if (row.getIsSelected()) {
                            setTotalPrice(newQuantity * unitPrice);
                        }
                    }
                };

                return (
                    <View className="absolute top-[-10px] right-[70px] border border-gray-200 rounded">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => handleUpdateQuantity('DECREASE')}
                            >
                                <View className="w-[20px] px-4 py-1 justify-center items-center text-sm font-JakartaSemiBold">
                                    <Image
                                        source={icons.minus}
                                        className="w-4 h-4 text-gray-200 font-JakartaSemiBold"
                                    />
                                </View>
                            </TouchableOpacity>
                            <TextInput
                                editable={false}
                                className="border-x border-gray-200 text-black text-center w-10 font-JakartaSemiBold text-md flex items-center justify-center"
                                value={String(quantity)}
                            />
                            <TouchableOpacity
                                onPress={() => handleUpdateQuantity('INCREASE')}
                            >
                                <View className="w-[20px] px-4 py-1 justify-center items-center text-sm">
                                    <Image
                                        source={icons.plus}
                                        className="w-4 h-4 text-black font-JakartaSemiBold"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            },
        },
    ];

    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selectedOption, setSelectedOption] = useState<ProductOption>();
    const [currentOption, setCurrentOption] = useState<ProductOption>();
    const [otherOptions, setOtherOptions] = useState<ProductOption[]>([]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setCurrentOption(undefined);
                setSelectedOption(undefined);
                setSorting([]);
                setColumnFilters([]);
                setRowSelection({});
                bottomSheetRef.current?.close();
            };
        }, []),
    );

    const handleSelectedOption = async () => {
        if (!currentOption || selectedOption!.id === currentOption!.id) return;
        const response = (await accountApiRequest.changeProductOption(
            accessToken,
            {
                oldOptionId: selectedOption!.id,
                newOptionId: currentOption!.id,
            },
        )) as ChangeProductOptionResponseType;
        if (response.statusCode === 200) {
            accountApiRequest
                .getProductsFromCart(accessToken)
                .then((response) => {
                    if (response?.statusCode === 200) {
                        setCartProducts(response?.data);
                    }
                });
        }
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        let total = 0;
        table.getSelectedRowModel().rows.forEach((row) => {
            total += row.original.total;
        });
        setTotalPrice(total);
    }, [table.getSelectedRowModel().rows.map((row) => row.id)]); //eslint-disable-line

    const handleCheckout = () => {
        const selectedRows = table
            .getSelectedRowModel()
            .rows.filter((row) => row.getIsSelected());

        if (!selectedRows.length) {
            return Toast.show({
                type: 'info',
                text1: 'Chọn sản phẩm để  thanh toán',
            });
        }

        if (!(userProfile?.phone && userAddress?.ward)) {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng cập nhật số điện thoại và địa chỉ nhận hàng trước khi thanh toán',
            });
            return router.push('/(root)/edit-address' as Href);
        }
        setLoading(true);

        const productCheckout: ProductCheckout[] = selectedRows.map((row) => {
            const data = row.original;
            const quantity = data.quantity;
            const priceModifier = data.selectedOption.price_modifier;
            const unitPrice = data.unitPrice;
            const discount = data.selectedOption.discount;

            return {
                id: data.selectedOption.id,
                name: data.product.name,
                thumbnail: data.selectedOption.thumbnail,
                unitPrice,
                priceModifier,
                quantity,
                weight: data.selectedOption.weight,
                discount,
            };
        });
        setProductCheckout(productCheckout);
        setLoading(false);
        router.push('/(root)/checkout' as Href);
    };

    const handleDeleteProduct = async (row: Row<CartTableColumn>) => {
        const productId = row.original.id;
        const productOptionId = row.original.selectedOption.id;
        const response = (await accountApiRequest.removeProductFromCart(
            accessToken,
            {
                productOptionId,
            },
        )) as RemoveCartProductResponseType;
        if (response.statusCode === 200) {
            removeCartItem(productId);
            Toast.show({ text1: 'Xóa thành công' });
        }
    };

    return (
        <GestureHandlerRootView>
            <View className="relative h-screen bg-white">
                <ScrollView className="bg-[#f2f2f2] mb-[100px]">
                    {table?.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const checkboxCell = row
                                .getVisibleCells()
                                .find((cell) => {
                                    if (!cell.getValue()) return true;
                                });
                            return (
                                <SwipeToDeleteCartItem
                                    key={row.id}
                                    row={row}
                                    onDelete={() => handleDeleteProduct(row)}
                                    checkboxCell={checkboxCell}
                                    setRowSelection={setRowSelection}
                                />
                            );
                        })
                    ) : (
                        <View className="h-24 justify-center items-center">
                            <Text>Chưa có sản phẩm</Text>
                        </View>
                    )}
                </ScrollView>
                {userProfile?.email && (
                    <View className="border-t border-gray-200 p-4 fixed bottom-[100px] bg-white">
                        <View className="flex-row justify-end items-center gap-4">
                            <Text className="font-JakartaSemiBold text-2xl">
                                {formatPrice(totalPrice)}
                            </Text>
                            <View>
                                {loading ? (
                                    <View className="mt-4 flex justify-center font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                        />
                                    </View>
                                ) : (
                                    <Button
                                        onPress={handleCheckout}
                                        label={`${table.getFilteredSelectedRowModel().rows.length === 0 ? 'Kiểm tra' : `Đặt hàng (${table.getFilteredSelectedRowModel().rows.length})`}`}
                                        labelClasses="font-JakartaBold text-white"
                                        className="mt-4 font-JakartaBold bg-black min-w-[120px] rounded-md"
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                )}
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['85%', '85%']}
            >
                <BottomSheetScrollView
                    style={{
                        flex: 1,
                        padding: 20,
                    }}
                >
                    <Text className="mb-2 pb-1 border-b border-gray-200">
                        Sản phẩm
                    </Text>
                    {otherOptions?.length > 0 &&
                        otherOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentOption(option);
                                }}
                            >
                                <View
                                    className={`${option.id === currentOption?.id ? 'border border-red-500' : 'border-none'} rounded-md flex-row p-2 m-1 gap-3 items-center`}
                                >
                                    <Image
                                        source={{
                                            uri: option.thumbnail,
                                        }}
                                        width={30}
                                        height={30}
                                        alt={option.sku}
                                    />
                                    <View className="items-start">
                                        <View className="text-sm leading-none">
                                            <Text className="text-sm font-JakartaMedium">
                                                {option.sku}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-sm font-JakartaMedium">
                                        ({option?.stock})
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                </BottomSheetScrollView>
                <Button
                    onPress={() => {
                        handleSelectedOption();
                        bottomSheetRef.current?.close();
                    }}
                    label="Xác nhận"
                    labelClasses="font-JakartaBold text-white"
                    className="mb-20 mx-4 font-JakartaBold bg-black min-w-[120px] rounded-md"
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
}
