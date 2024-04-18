import { Checkbox } from '@/components/ui/checkbox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

type CheckboxFieldProps = {
    form: any;
    name: string;
    label: string;
    items: Array<{ id: string; label: string }>;
    handleFilterProduct: () => void;
};

export default function CheckBoxFormField(props: CheckboxFieldProps) {
    const { form, name, label, items, handleFilterProduct } = props;

    return (
        <FormField
            control={form.control}
            name={name}
            render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">{label}</FormLabel>
                    </div>
                    {items.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name={name}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(
                                                    item.id,
                                                )}
                                                onCheckedChange={(
                                                    checked: boolean,
                                                ) => {
                                                    checked
                                                        ? field.onChange([
                                                            ...field.value,
                                                            item.id,
                                                        ])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (
                                                                    value: string,
                                                                ) =>
                                                                    value !==
                                                                    item.id,
                                                            ),
                                                        );
                                                    return handleFilterProduct();
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            {item.label}
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />
                    ))}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
