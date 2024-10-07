import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import TechnicalSpecsList from '@/app/admin/products/add/components/technical-specs-list';

const TechnicalSpecsCard = ({
    setTechnicalSpecs,
}: {
    setTechnicalSpecs: React.Dispatch<
        React.SetStateAction<TechnicalSpecsItem[]>
    >;
}) => {
    const [specs, setSpecs] = useState<TechnicalSpecsItem[]>([
        { name: '', value: '' },
    ]);

    useEffect(() => {
        setTechnicalSpecs(
            specs.filter((spec) => spec.name !== '' && spec.value !== ''),
        );
    }, [specs, setTechnicalSpecs]);
    return (
        <Card id="technical-specs">
            <CardHeader>
                <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent>
                <TechnicalSpecsList specs={specs} setSpecs={setSpecs} />
            </CardContent>
        </Card>
    );
};

export default TechnicalSpecsCard;
