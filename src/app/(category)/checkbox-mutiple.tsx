'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CheckBoxFormField from '@/app/(category)/checkbox-form-field';

type FilterFieldType = { id: string; label: string };
type CheckboxMultipleProps = {
    form: any;
    onSubmit: (data: any) => void;
    productFilterBox: Array<{
        name: string;
        label: string;
        items: Array<FilterFieldType>;
    }>;
};

export function CheckboxMultiple(props: CheckboxMultipleProps) {
    const { form, onSubmit, productFilterBox } = props;
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            />
                        );
                    })}

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
