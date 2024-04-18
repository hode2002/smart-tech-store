'use client';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { AddressOption } from '@/app/(user)/user/account/address/update-address-form';

type AddressProps = {
    title: string;
    items: Array<AddressOption>;
    value: string | undefined;
    setValue: React.Dispatch<React.SetStateAction<AddressOption | undefined>>;
    isDisabled?: boolean;
};

export default function AddressCombobox(props: AddressProps) {
    const { title, items, value, setValue, isDisabled } = props;
    const [open, setOpen] = React.useState(false);
    const selectedItem = value ? value : title;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full md:w-[200px] justify-between ${isDisabled ? 'cursor-not-allowed' : 'cursor-auto'}`}
                    disabled={isDisabled}
                >
                    {selectedItem}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Tìm kiếm..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy</CommandEmpty>
                        <CommandGroup>
                            {items.length > 0 &&
                                items?.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={() => {
                                            setValue(item);
                                            setOpen(false);
                                        }}
                                    >
                                        {item.label}
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                value === item.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
