'use client';
import { Form } from '@/components/ui/form';
import CheckBoxFormField from '@/app/(category)/checkbox-form-field';

type FilterFieldType = { id: string; label: string };
type CheckboxMultipleProps = {
    form: any;
    handleFilterProduct: () => void;
    productFilterBox: Array<{
        name: string;
        label: string;
        items: Array<FilterFieldType>;
    }>;
};

export function CheckboxMultiple(props: CheckboxMultipleProps) {
    const { form, productFilterBox, handleFilterProduct } = props;
    return (
        <Form {...form}>
            <form className="space-y-8">
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
            </form>
        </Form>
    );
}
