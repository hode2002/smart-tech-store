import EditTechnicalSpecsInput from '@/app/admin/products/edit/components/edit-technical-specs-input';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import React from 'react';

const EditTechnicalSpecsList = ({
    specs,
    setSpecs,
}: {
    specs: TechnicalSpecsItem[];
    setSpecs: React.Dispatch<React.SetStateAction<TechnicalSpecsItem[]>>;
}) => {
    return (
        <div className="grid gap-6 sm:grid-cols-3">
            <div className="grid col-span-12 gap-3">
                {specs
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((spec, index) => (
                        <EditTechnicalSpecsInput
                            key={index}
                            setSpecs={setSpecs}
                            spec={spec}
                        />
                    ))}
            </div>
        </div>
    );
};

export default EditTechnicalSpecsList;
