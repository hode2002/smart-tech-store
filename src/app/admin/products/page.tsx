'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import ProductTable from '@/app/admin/products/product-table';
import { useAppSelector } from '@/lib/store';
import { useCallback, useEffect, useState } from 'react';
import {
    ProductDetailType,
    ProductPaginationResponseType,
} from '@/schemaValidations/product.schema';
import adminApiRequest, { CreateBrandResponseType } from '@/apiRequests/admin';
import CategoryTable from '@/app/admin/products/(category)/category-table';
import BrandTable from '@/app/admin/products/(brands)/brand-table';
import {
    CategoryResponseType,
    CategoryType,
} from '@/schemaValidations/category.schema';
import { BrandResponseType, BrandType } from '@/schemaValidations/brand.schema';
import { AddBrandModal } from './(brands)/add-brand-modal';
import { toast } from '@/components/ui/use-toast';
import { AddCategoryModal } from '@/app/admin/products/(category)/add-category-modal';
import categoryApiRequest from '@/apiRequests/category';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type Page = {
    totalPages: number;
    nextPage?: number;
    previousPage?: number;
};
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export default function Product() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const router = useRouter();
    const [products, setProducts] = useState<ProductDetailType[] | []>([]);
    const [filterProducts, setFilterProducts] = useState<ProductDetailType[]>(
        [],
    );
    const [pagination, setPagination] = useState<Page>();
    const [currPage, setCurrPage] = useState<number>(1);

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [brands, setBrands] = useState<BrandType[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedBrand, setSelectedBrand] = useState<string>('all');

    const fetchProducts = useCallback(
        async (page: number = 1) => {
            const response = (await adminApiRequest.getAllProducts(
                token,
                page,
            )) as ProductPaginationResponseType;
            if (response?.statusCode === 200) {
                setPagination({ ...response.data });
                return setProducts(response.data.products);
            }
            return setProducts([]);
        },
        [token],
    );

    const fetchBrands = useCallback(async () => {
        const response = (await adminApiRequest.getAllBrands(
            token,
        )) as BrandResponseType;
        if (response?.statusCode === 200) {
            return setBrands(response.data);
        }
        return setBrands([]);
    }, [token]);

    const fetchCategories = useCallback(async () => {
        const response =
            (await categoryApiRequest.getCategories()) as CategoryResponseType;
        if (response?.statusCode === 200) {
            return setCategories(response.data);
        }
        return setCategories([]);
    }, []);

    useEffect(() => {
        fetchProducts().then();
        fetchBrands().then();
        fetchCategories().then();
    }, [fetchProducts, fetchBrands, fetchCategories]);

    useEffect(() => {
        setFilterProducts(products);
    }, [products]);

    const handlePageTransitions = (page: number) => {
        setCurrPage(page);
        fetchProducts(page).then();
    };

    const handleAddBrand = async (
        name: string,
        file: File,
        description?: string,
    ) => {
        const response: CreateBrandResponseType =
            await adminApiRequest.createNewBrand(token, {
                name,
                logo_url: file,
                description,
            });

        if (response?.statusCode === 201) {
            setBrands([...brands, response.data]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const handleAddCategory = async (name: string, description?: string) => {
        const response: CreateBrandResponseType =
            await adminApiRequest.createNewCategory(token, {
                name,
                description,
            });

        if (response?.statusCode === 201) {
            setCategories([...categories, response.data]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        if (selectedCategory === 'all' && selectedBrand === 'all') {
            setFilterProducts(products);
        } else {
            const filteredProducts = products.filter((product) => {
                const categoryMatch =
                    selectedCategory === 'all' ||
                    product.category.slug === selectedCategory;
                const brandMatch =
                    selectedBrand === 'all' ||
                    product.brand.slug === selectedBrand;
                return categoryMatch && brandMatch;
            });
            setFilterProducts(filteredProducts);
        }
    }, [products, selectedCategory, selectedBrand]);

    useEffect(() => {
        if (searchText) {
            setFilterProducts(
                products.filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchText.toLowerCase()),
                ),
            );
        } else {
            setFilterProducts(products);
        }
    }, [products, setFilterProducts, searchText]);

    const [productType, setProductType] = useState<string>('simple');
    const handleRedirect = () => {
        router.push('/admin/products/add/' + productType);
    };

    return (
        <section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-muted/40">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Sản phẩm</TabsTrigger>
                        <TabsTrigger value="category">Danh mục</TabsTrigger>
                        <TabsTrigger value="brand">Thương hiệu</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center">
                        <TabsContent
                            value="all"
                            className="flex items-center gap-2 capitalize"
                        >
                            <div className="relative ml-auto md:grow-0 flex gap-2">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    type="search"
                                    placeholder="Nhập tên sản phẩm"
                                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                />
                            </div>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-[180px] bg-popover capitalize">
                                    <SelectValue className="capitalize" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="capitalize">
                                        <SelectLabel>Danh mục</SelectLabel>
                                        <SelectItem value={'all'}>
                                            Tất cả
                                        </SelectItem>
                                        {categories &&
                                            categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.slug}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedBrand}
                                onValueChange={setSelectedBrand}
                            >
                                <SelectTrigger className="w-[180px] bg-popover capitalize">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className="capitalize">
                                        <SelectLabel>Thương hiệu</SelectLabel>
                                        <SelectItem value={'all'}>
                                            Tất cả
                                        </SelectItem>
                                        {brands &&
                                            brands.map((brand) => (
                                                <SelectItem
                                                    key={brand.id}
                                                    value={brand.slug}
                                                >
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="h-7 gap-1 py-4"
                                    >
                                        <PlusCircle className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Thêm sản phẩm
                                        </span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Loại sản phẩm
                                        </AlertDialogTitle>
                                        <RadioGroup
                                            value={productType}
                                            onValueChange={setProductType}
                                        >
                                            <AlertDialogDescription>
                                                <span className="flex items-center space-x-2 my-2">
                                                    <RadioGroupItem
                                                        value="simple"
                                                        id="simple"
                                                    />
                                                    <Label htmlFor="simple">
                                                        Sản phẩm đơn giản
                                                    </Label>
                                                </span>
                                                <span className="flex items-center space-x-2 my-2">
                                                    <RadioGroupItem
                                                        value="variant"
                                                        id="variant"
                                                    />
                                                    <Label htmlFor="variant">
                                                        Sản phẩm có biến thể
                                                    </Label>
                                                </span>
                                            </AlertDialogDescription>
                                        </RadioGroup>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Hủy
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleRedirect}
                                        >
                                            Tiếp tục
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TabsContent>
                        <TabsContent
                            value="category"
                            className="flex items-center gap-2 capitalize"
                        >
                            <Button size="sm" className="h-7 gap-1 py-4">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    <AddCategoryModal
                                        handleAddCategory={handleAddCategory}
                                    />
                                </span>
                            </Button>
                        </TabsContent>
                        <TabsContent
                            value="brand"
                            className="flex items-center gap-2 capitalize"
                        >
                            <Button size="sm" className="h-7 gap-1 py-4">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    <AddBrandModal
                                        handleAddBrand={handleAddBrand}
                                    />
                                </span>
                            </Button>
                        </TabsContent>
                    </div>
                </div>
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách sản phẩm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filterProducts && filterProducts?.length > 0 ? (
                                <ProductTable products={filterProducts} />
                            ) : (
                                <p className="text-center">Không tìm thấy</p>
                            )}
                        </CardContent>
                        {filterProducts && filterProducts?.length > 0 && (
                            <CardFooter>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={() => {
                                                    if (
                                                        !pagination?.previousPage
                                                    ) {
                                                        return;
                                                    }
                                                    return handlePageTransitions(
                                                        pagination?.previousPage as number,
                                                    );
                                                }}
                                            />
                                        </PaginationItem>
                                        {pagination && (
                                            <>
                                                {Array.from(
                                                    {
                                                        length: pagination.totalPages,
                                                    },
                                                    (_, index) => (
                                                        <PaginationItem
                                                            key={index}
                                                        >
                                                            <PaginationLink
                                                                href="#"
                                                                onClick={() => {
                                                                    if (
                                                                        currPage ===
                                                                        index +
                                                                            1
                                                                    )
                                                                        return;
                                                                    return handlePageTransitions(
                                                                        index +
                                                                            1,
                                                                    );
                                                                }}
                                                                isActive={
                                                                    currPage ===
                                                                    index + 1
                                                                        ? true
                                                                        : false
                                                                }
                                                            >
                                                                {index + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    ),
                                                )}
                                            </>
                                        )}
                                        <PaginationItem
                                            onClick={() => {
                                                if (!pagination?.nextPage) {
                                                    return;
                                                }
                                                return handlePageTransitions(
                                                    pagination?.nextPage as number,
                                                );
                                            }}
                                        >
                                            <PaginationNext href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
                <TabsContent value="category">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh mục</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CategoryTable categories={categories} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="brand">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thương hiệu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BrandTable brands={brands} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
}
