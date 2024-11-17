import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import adminApiRequest, { OptionValueType } from '@/apiRequests/admin';
import { useAppSelector } from '@/lib/store';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectAttributeItem from '@/app/admin/products/add/components/select-attribute-item';
import { AttributeType } from '@/app/admin/products/add/variant/page';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type Props = {
    attributes: AttributeType[];
    setAttributes: Dispatch<SetStateAction<AttributeType[]>>;
    handleCreateProductAttribute: () => void;
};
const SelectAttributeCard = (props: Props) => {
    const { attributes, setAttributes, handleCreateProductAttribute } = props;

    const token = useAppSelector((state) => state.auth.accessToken);

    const [optionValues, setOptionValues] = useState<OptionValueType[]>([]);

    useEffect(() => {
        adminApiRequest.getOptionValue(token).then((res) => {
            setOptionValues(res.data);
        });
    }, [token]);

    const handleAddAttribute = (newAttribute: AttributeType) => {
        const targetAttribute = attributes.find(
            (a) => a.id === newAttribute.id,
        );
        if (targetAttribute?.id) {
            setAttributes(
                attributes.map((a) => {
                    if (a.id === newAttribute.id) {
                        a.value = newAttribute.value;
                    }
                    return a;
                }),
            );
        } else {
            setAttributes([...attributes, newAttribute]);
        }
    };

    const handleDeleteAttribute = (attribute: AttributeType) => {
        setAttributes(attributes.filter((a) => a.id !== attribute.id));
    };

    const [currentName, setCurrentName] = useState<string>('');
    const [currentValue, setCurrentValue] = useState<string>('');

    const handleSubmit = () => {
        const newAttribute: AttributeType = {
            id: optionValues.find((e) => e.name === currentName)!.id,
            name: currentName,
            value: currentValue,
        };

        handleAddAttribute(newAttribute);

        setCurrentName('');
        setCurrentValue('');
    };

    return (
        <div
            id="create-attribute"
            className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
        >
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Badge variant="default" className="font-extrabold">
                                2
                            </Badge>
                            <span className="font-extrabold">
                                Tạo thuộc tính
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-4">
                                {attributes &&
                                    attributes.map((attribute) => (
                                        <SelectAttributeItem
                                            key={attribute.id}
                                            attribute={attribute}
                                            handleAddAttribute={
                                                handleAddAttribute
                                            }
                                            handleDeleteAttribute={
                                                handleDeleteAttribute
                                            }
                                        />
                                    ))}

                                <div className="flex items-center gap-3">
                                    <Select
                                        value={currentName}
                                        onValueChange={setCurrentName}
                                    >
                                        <SelectTrigger
                                            id="option"
                                            className="bg-popover capitalize w-[30%]"
                                        >
                                            <SelectValue className="capitalize" />
                                        </SelectTrigger>
                                        <SelectContent className="capitalize">
                                            {optionValues.map((option) => (
                                                <SelectItem
                                                    key={option.id}
                                                    value={option.name}
                                                >
                                                    {option.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        id="name"
                                        type="text"
                                        className="w-full"
                                        autoComplete="off"
                                        placeholder="Các giá trị cách nhau bằng dấu |"
                                        value={currentValue}
                                        onChange={(e) =>
                                            setCurrentValue(e.target.value)
                                        }
                                    />

                                    <div className="flex gap-4 bg-popover items-center">
                                        <Button
                                            size="sm"
                                            className="h-7 gap-1 py-4"
                                            onClick={handleSubmit}
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Lưu
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleCreateProductAttribute}
                        >
                            Bước tiếp theo
                            <ArrowRight className="mx-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SelectAttributeCard;
