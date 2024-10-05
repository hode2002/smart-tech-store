import { AddressOption } from '@/types/type';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SelectCountry } from 'react-native-element-dropdown';

const Dropdown = ({
    title,
    items,
    value,
    setValue,
    isDisabled,
}: {
    title: string;
    items: AddressOption[];
    value: string | undefined;
    setValue: React.Dispatch<React.SetStateAction<AddressOption | undefined>>;
    isDisabled?: boolean;
}) => {
    return (
        <SelectCountry
            disable={isDisabled ?? false}
            style={isDisabled ? styles.dropdownDisabled : styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            imageStyle={styles.imageStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            maxHeight={300}
            value={value}
            data={items}
            valueField="value"
            labelField="label"
            imageField="image"
            placeholder={isDisabled ? value : title}
            searchPlaceholder="Tìm kiếm..."
            onChange={(item) => {
                setValue(item);
            }}
        />
    );
};

export default Dropdown;

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    imageStyle: {
        width: 24,
        height: 24,
    },
    placeholderStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    dropdownDisabled: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        backgroundColor: '#e2e2e2',
    },
});
