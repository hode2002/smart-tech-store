import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { BrandResponseType, BrandType } from '@/schemaValidations/brand.schema';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import brandApiRequest from '@/apiRequests/brand';

type Props = {
    setSelectedBrand: Dispatch<SetStateAction<BrandType | undefined>>;
};
const SelectBrandCard = (props: Props) => {
    const { setSelectedBrand } = props;

    const [selectedName, setSelectedName] = useState<string>('');
    const [brands, setBrands] = useState<BrandType[]>([]);

    const fetchBrands = useCallback(async () => {
        const response =
            (await brandApiRequest.getBrands()) as BrandResponseType;
        if (response?.statusCode === 200) {
            return setBrands(response.data);
        }
        return setBrands([]);
    }, []);

    useEffect(() => {
        fetchBrands().then();
    }, [fetchBrands]);

    useEffect(() => {
        setSelectedBrand!(
            brands.find((brand) => brand.slug === selectedName) ?? brands[0],
        );
    }, [selectedName, setSelectedBrand, brands]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thương hiệu</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid col-span-12 gap-3">
                        <Label htmlFor="brand">Chọn thương hiệu sản phẩm</Label>
                        <Select
                            value={selectedName}
                            onValueChange={setSelectedName}
                        >
                            <SelectTrigger
                                id="brand"
                                className="bg-popover capitalize"
                            >
                                <SelectValue className="capitalize" />
                            </SelectTrigger>
                            <SelectContent className="capitalize">
                                {brands.map((brand) => (
                                    <SelectItem
                                        key={brand.id}
                                        value={brand.slug}
                                    >
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SelectBrandCard;
