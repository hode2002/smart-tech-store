import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    CategoryResponseType,
    CategoryType,
} from '@/schemaValidations/category.schema';
import categoryApiRequest from '@/apiRequests/category';

type Props = {
    setSelectedCategory: Dispatch<SetStateAction<CategoryType | undefined>>;
};
const SelectCategoryCard = (props: Props) => {
    const { setSelectedCategory } = props;

    const [selectedName, setSelectedCateName] = useState<string>('');
    const [categories, setCategories] = useState<CategoryType[]>([]);

    const fetchCategories = useCallback(async () => {
        const response =
            (await categoryApiRequest.getCategories()) as CategoryResponseType;
        if (response?.statusCode === 200) {
            return setCategories(response.data);
        }
        return setCategories([]);
    }, []);

    useEffect(() => {
        fetchCategories().then();
    }, [fetchCategories]);

    useEffect(() => {
        setSelectedCategory!(
            categories.find((cate) => cate.slug === selectedName) ??
                categories[0],
        );
    }, [selectedName, setSelectedCategory, categories]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid col-span-12 gap-3">
                        <Label htmlFor="category">Chọn danh mục sản phẩm</Label>
                        <Select
                            value={selectedName}
                            onValueChange={setSelectedCateName}
                        >
                            <SelectTrigger
                                id="category"
                                className="bg-popover capitalize"
                            >
                                <SelectValue className="capitalize" />
                            </SelectTrigger>
                            <SelectContent className="capitalize">
                                {categories.map((cate) => (
                                    <SelectItem key={cate.id} value={cate.slug}>
                                        {cate.name}
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

export default SelectCategoryCard;
