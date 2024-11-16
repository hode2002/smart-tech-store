import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import TechnicalSpecsList from '@/app/admin/products/add/components/technical-specs-list';

type SpecTypes = {
    [key: string]: TechnicalSpecsItem[];
};

const TechnicalSpecsCard = ({
    setTechnicalSpecs,
    category,
}: {
    category: string;
    setTechnicalSpecs: React.Dispatch<
        React.SetStateAction<TechnicalSpecsItem[]>
    >;
}) => {
    const specTypes: SpecTypes = useMemo(() => {
        return {
            smartphone: [
                { name: 'Dung lượng lưu trữ', value: '', disabled: true },
                { name: 'Hệ điều hành', value: '', disabled: true },
                { name: 'Kết nối', value: '', disabled: true },
                { name: 'Khối lượng', value: '', disabled: true },
                { name: 'Pin, sạc', value: '', disabled: true },
                { name: 'ram', value: '', disabled: true },
                { name: '', value: '' },
            ],
            laptop: [
                { name: 'CPU', value: '', disabled: true },
                { name: 'Tần số quét', value: '', disabled: true },
                { name: 'Độ phân giải', value: '', disabled: true },
                { name: 'Khối lượng', value: '', disabled: true },
                { name: 'Pin, sạc', value: '', disabled: true },
                { name: 'ram', value: '', disabled: true },
                { name: 'ổ cứng', value: '', disabled: true },
                { name: '', value: '' },
            ],
            tablet: [
                { name: 'Dung lượng lưu trữ', value: '', disabled: true },
                { name: 'Hệ điều hành', value: '', disabled: true },
                { name: 'Kết nối', value: '', disabled: true },
                { name: 'Khối lượng', value: '', disabled: true },
                { name: 'Pin, sạc', value: '', disabled: true },
                { name: 'ram', value: '', disabled: true },
                { name: '', value: '' },
            ],
        };
    }, []);

    const [specs, setSpecs] = useState<
        (TechnicalSpecsItem & { disabled?: boolean })[]
    >(specTypes[category] ?? [{ name: '', value: '' }]);

    useEffect(() => {
        setSpecs(specTypes[category] ?? [{ name: '', value: '' }]);
    }, [category, specTypes]);

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
