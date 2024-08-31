import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttributeType } from '@/app/admin/products/add/variant/page';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

type Props = {
    attribute: AttributeType;
    handleAddAttribute: (newAttribute: AttributeType) => void;
    handleDeleteAttribute: (attribute: AttributeType) => void;
};
const SelectAttributeItem = (props: Props) => {
    const { attribute, handleAddAttribute, handleDeleteAttribute } = props;

    const [currentValue, setCurrentValue] = useState<string>('');

    useEffect(() => {
        setCurrentValue(attribute.value);
    }, [attribute.value]);

    const handleSubmit = () => {
        const newAttribute: AttributeType = {
            ...attribute,
            value: currentValue,
        };

        handleAddAttribute(newAttribute);
    };

    return (
        <div className="flex items-center gap-3">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="px-3">
                        {attribute.name}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-2 items-center">
                            <Input
                                id="name"
                                type="text"
                                className="w-[90%]"
                                autoComplete="off"
                                placeholder="Các giá trị cách nhau bằng dấu |"
                                value={currentValue}
                                onChange={(e) =>
                                    setCurrentValue(e.target.value)
                                }
                            />
                            <Button
                                size="sm"
                                className="h-7 gap-1 py-4"
                                onClick={handleSubmit}
                            >
                                <Check className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Cập nhật
                                </span>
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="flex gap-4 bg-popover items-center">
                <Button
                    size="sm"
                    onClick={() => handleDeleteAttribute(attribute)}
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    );
};

export default SelectAttributeItem;
