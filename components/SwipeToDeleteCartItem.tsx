import { icons } from '@/constants';
import { CartTableColumn } from '@/types/type';
import { Cell, flexRender, Row } from '@tanstack/react-table';
import React, { useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { View, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const SwipeToDeleteCartItem = ({
    row,
    checkboxCell,
    onDelete,
    setRowSelection,
}: {
    row: Row<CartTableColumn>;
    checkboxCell: Cell<CartTableColumn, unknown> | undefined;
    onDelete: () => void;
    setRowSelection: (value: React.SetStateAction<{}>) => void;
}) => {
    const swipeabletRef = useRef<Swipeable>(null);
    useEffect(() => {
        return () => {
            swipeabletRef.current?.close();
        };
    }, []);

    const renderRightActions = () => {
        return (
            <TouchableOpacity onPress={onDelete}>
                <View className="bg-red-500 min-h-[230px] ml-8 w-24 justify-center items-center">
                    <Image
                        source={icons.trash}
                        tintColor="#fff"
                        className="w-8 h-8"
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            ref={swipeabletRef}
            renderRightActions={renderRightActions}
            overshootRight={false}
        >
            <View className="flex-row bg-white mb-3 min-h-[230px]">
                <TouchableOpacity
                    onPress={() => {
                        setRowSelection((prev) => ({
                            ...prev,
                            [row.id]: !row.getIsSelected(),
                        }));
                    }}
                    children={
                        <View className="py-5 px-3">
                            {flexRender(
                                checkboxCell!.column.columnDef.cell,
                                checkboxCell!.getContext(),
                            )}
                        </View>
                    }
                />
                <View className="flex-col py-4 bg-white w-full">
                    {row.getVisibleCells().map((cell) => {
                        const value = cell.getValue();
                        if (!value) return;
                        return (
                            <View key={cell.id} className="p-2">
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </Swipeable>
    );
};

export default SwipeToDeleteCartItem;
