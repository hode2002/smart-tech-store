import React from 'react';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import EditTechnicalSpecsList from '@/app/admin/products/edit/components/edit-technical-specs-list';

const EditTechnicalSpecsCard = ({
    setTechnicalSpecs,
    technicalSpecs,
}: {
    setTechnicalSpecs: React.Dispatch<
        React.SetStateAction<TechnicalSpecsItem[]>
    >;
    technicalSpecs: TechnicalSpecsItem[];
}) => {
    return (
        <>
            <p className="font-semibold mt-4">Thông số kỹ thuật</p>
            <EditTechnicalSpecsList
                specs={technicalSpecs}
                setSpecs={setTechnicalSpecs}
            />
        </>
    );
};

export default EditTechnicalSpecsCard;
