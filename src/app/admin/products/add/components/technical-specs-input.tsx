import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const TechnicalSpecsInput = ({
    setSpecs,
    onDeleteSpec,
    spec,
    addEmptyInput,
}: {
    setSpecs: React.Dispatch<React.SetStateAction<TechnicalSpecsItem[]>>;
    onDeleteSpec: (name: string, value: string) => void;
    spec: TechnicalSpecsItem;
    addEmptyInput: () => void;
}) => {
    useEffect(() => {
        setName(spec.name);
        setValue(spec.value);
    }, [spec]);

    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<string>('');

    const handleInputChange = (newName: string, newValue: string) => {
        setName(newName);
        setValue(newValue);

        if (newName !== '' && newValue !== '') {
            setSpecs((prev) => {
                const isExist = prev.some(
                    (item) =>
                        item.name === spec.name && item.value === spec.value,
                );

                if (!isExist) {
                    return [...prev, { name: newName, value: newValue }];
                }

                return prev.map((item) =>
                    item.name === spec.name && item.value === spec.value
                        ? { name: newName, value: newValue }
                        : item,
                );
            });

            addEmptyInput();
        }
    };

    return (
        <div className="flex gap-3 my-1 items-center justify-between">
            <Input
                className="w-[30%]"
                type="text"
                autoComplete="off"
                value={name}
                onChange={(e) => handleInputChange(e.target.value, value)}
                placeholder="Tên"
            />
            <Input
                type="text"
                autoComplete="off"
                className="w-[70%]"
                value={value}
                onChange={(e) => handleInputChange(name, e.target.value)}
                placeholder="Giá trị"
            />
            {name && value && (
                <Button
                    onClick={() => onDeleteSpec(name, value)}
                    variant={'outline'}
                >
                    <Trash2 />
                </Button>
            )}
        </div>
    );
};

export default TechnicalSpecsInput;
