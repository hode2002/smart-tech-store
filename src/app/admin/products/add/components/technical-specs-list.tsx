import TechnicalSpecsInput from '@/app/admin/products/add/components/technical-specs-input';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import React from 'react';

const TechnicalSpecsList = ({
    specs,
    setSpecs,
}: {
    specs: TechnicalSpecsItem[];
    setSpecs: React.Dispatch<React.SetStateAction<TechnicalSpecsItem[]>>;
}) => {
    const onDeleteSpec = (name: string, value: string) => {
        setSpecs((prev) => {
            const newSpecs = prev.filter(
                (spec) => !(spec.name === name && spec.value === value),
            );

            if (
                newSpecs.length === 0 ||
                newSpecs.every((spec) => spec.name && spec.value)
            ) {
                return [...newSpecs, { name: '', value: '' }];
            }
            return newSpecs;
        });
    };

    const addEmptyInput = () => {
        setSpecs((prev) => {
            if (
                prev.length === 0 ||
                (prev[prev.length - 1].name !== '' &&
                    prev[prev.length - 1].value !== '')
            ) {
                return [...prev, { name: '', value: '' }];
            }
            return prev;
        });
    };

    return (
        <div className="grid gap-6 sm:grid-cols-3">
            <div className="grid col-span-12 gap-3">
                {specs.map((spec, index) => (
                    <TechnicalSpecsInput
                        key={index}
                        onDeleteSpec={onDeleteSpec}
                        setSpecs={setSpecs}
                        spec={spec}
                        addEmptyInput={addEmptyInput}
                    />
                ))}
            </div>
        </div>
    );
};

export default TechnicalSpecsList;
