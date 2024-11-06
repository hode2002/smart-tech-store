import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import React from 'react';
import { Checkbox } from 'native-base';

type CheckboxFieldProps = {
    form: any;
    name: string;
    label: string;
    items: { id: string; label: string }[];
    handleFilterProduct: () => void;
};

export default function CheckBoxFormField(props: CheckboxFieldProps) {
    const { form, name, label, items, handleFilterProduct } = props;
    const { control } = form;

    return (
        <View className="mb-4">
            <Text className="font-JakartaBold pb-2">{label}</Text>
            <View className="gap-4">
                {items.map((item, index) => (
                    <Controller
                        key={index}
                        control={control}
                        name={name}
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-row gap-2">
                                <Checkbox
                                    colorScheme="red"
                                    className="rounded-full"
                                    value={item.label}
                                    isChecked={value?.includes(item.id)}
                                    onChange={(checked: boolean) => {
                                        if (checked) {
                                            onChange([...value, item.id]);
                                        } else {
                                            onChange(
                                                value?.filter(
                                                    (value: string) =>
                                                        value !== item.id,
                                                ),
                                            );
                                        }
                                        handleFilterProduct();
                                    }}
                                    aria-label="Select row"
                                />
                                <Text className="text-sm font-normal">
                                    {item.label}
                                </Text>
                            </View>
                        )}
                    />
                ))}
            </View>
        </View>
    );
}
