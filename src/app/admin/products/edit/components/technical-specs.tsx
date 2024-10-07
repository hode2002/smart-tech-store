import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import { Button } from '@/components/ui/button';

type Props = {
    technicalSpecs: TechnicalSpecsItem[];
    handleUpdateTechnicalSpecs: (updatedSpecs: TechnicalSpecsItem[]) => void;
};

const TechnicalSpecs = (props: Props) => {
    const { technicalSpecs, handleUpdateTechnicalSpecs } = props;
    const [editedSpecs, setEditedSpecs] = useState<TechnicalSpecsItem[]>([
        ...technicalSpecs,
    ]);

    const handleSpecChange = (name: string, value: string) => {
        const updatedSpecs = editedSpecs.map((spec) => {
            if (spec.name === name) {
                return { ...spec, value };
            }
            return spec;
        });
        setEditedSpecs(updatedSpecs);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Label htmlFor="technical-specs">Thông số kỹ thuật</Label>
                <Button
                    onClick={() => handleUpdateTechnicalSpecs(editedSpecs)}
                    size="sm"
                    className="min-w-[100px]"
                >
                    Cập nhật
                </Button>
            </div>
            {editedSpecs
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((spec) => (
                    <div
                        key={spec.name}
                        className="flex gap-3 my-1 items-center justify-between"
                    >
                        <Label
                            htmlFor={`technical-specs-${spec.name}`}
                            className="w-[30%]"
                        >
                            {spec.name}
                        </Label>
                        <Input
                            id={`technical-specs-${spec.name}`}
                            type="text"
                            autoComplete="off"
                            className="w-[70%]"
                            value={spec.value}
                            onChange={(e) =>
                                handleSpecChange(spec.name, e.target.value)
                            }
                        />
                    </div>
                ))}
        </>
    );
};

export default TechnicalSpecs;
