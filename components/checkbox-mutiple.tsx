import CheckBoxFormField from '@/components/checkbox-form-field';
import { View } from 'react-native';

type FilterFieldType = { id: string; label: string };
type CheckboxMultipleProps = {
    form: any;
    handleFilterProduct: () => void;
    productFilterBox: {
        name: string;
        label: string;
        items: FilterFieldType[];
    }[];
};

export function CheckboxMultiple(props: CheckboxMultipleProps) {
    const { form, productFilterBox, handleFilterProduct } = props;
    return (
        <View className="my-2 capitalize">
            {productFilterBox &&
                productFilterBox.map((field) => {
                    const { name, label, items } = field;
                    return (
                        <CheckBoxFormField
                            key={name}
                            form={form}
                            name={name}
                            label={label}
                            items={items}
                            handleFilterProduct={handleFilterProduct}
                        />
                    );
                })}
        </View>
    );
}
