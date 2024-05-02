'use client';

import {
    GetProductDetailResponseType,
    ProductDetailType,
} from '@/schemaValidations/product.schema';
import React, { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import adminApiRequest, {
    CreateProductOptionType,
    UpdateProductBodyType,
    UpdateProductResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { useAppSelector } from '@/lib/store';
import {
    CategoryResponseType,
    CategoryType,
} from '@/schemaValidations/category.schema';
import { BrandResponseType, BrandType } from '@/schemaValidations/brand.schema';
import categoryApiRequest from '@/apiRequests/category';
import ProductVariantCard from '@/app/admin/products/edit/components/product-variant-card';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';
import AddProductVariantCard from '@/app/admin/products/add/components/add-product-variant-card';

type Props = {
    params: { id: string };
};
export default function EditProduct({ params }: Props) {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [product, setProduct] = useState<ProductDetailType>();

    const [productName, setProductName] = useState<string>('');
    const [label, setLabel] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [warranties, setWarranties] = useState<string>('');
    const [promotions, setPromotions] = useState<string>('');
    const [mainImage, setMainImage] = useState<string>('');
    const [mainImageFile, setMainImageFile] = useState<File | undefined>();
    const [price, setPrice] = useState<number>(0);

    const fetchProduct = useCallback(async () => {
        const response = (await adminApiRequest.getProductById(
            token,
            params.id,
        )) as GetProductDetailResponseType;
        return response.data;
    }, [token, params.id]);

    useEffect(() => {
        fetchProduct().then((data) => {
            setSelectedCategory(data.category.slug);
            setSelectedBrand(data.brand.slug);
            setPromotions(data.promotions.join('###'));
            setWarranties(data.warranties.join('###'));
            setDescription(
                data.descriptions.map((item) => item.content).join('###'),
            );
            setMainImage(data.main_image);
            setProductName(data.name);
            setLabel(data.label);
            setPrice(data.price);
            setProduct(data);
        });
    }, [fetchProduct]);

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [brands, setBrands] = useState<BrandType[]>([]);

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
        fetchBrands().then();
        fetchCategories().then();
    }, [fetchBrands, fetchCategories]);

    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        let mainImageS3: string | undefined = undefined;

        if (mainImageFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                mainImageFile,
            )) as UploadSingleFileResponseType;
            mainImageS3 = response.data?.key;
        }

        const productEdited: UpdateProductBodyType = {
            ...(mainImageS3 && { main_image: mainImageS3 }),
            name: productName,
            price,
            label: label,
            brandId: brands.find((brand) => brand.slug === selectedBrand)
                ?.id as string,
            cateId: categories.find((cate) => cate.slug === selectedCategory)
                ?.id as string,
            warranties: warranties.split('###'),
            promotions: promotions.split('###'),
            descriptions: description
                .split('###')
                .map((item) => ({ content: item })),
        };

        const response = (await adminApiRequest.updateProduct(
            token,
            product!.id,
            productEdited,
        )) as UpdateProductResponseType;
        setLoading(false);
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const [variantLength, setVariantLength] = useState<number>(0);
    const [productVariants, setProductVariants] = useState<
        CreateProductOptionType[]
    >([]);

    const handleAddVariant = (newVariant: CreateProductOptionType) => {
        setProductVariants([...productVariants, newVariant]);
    };

    const handleDeleteVariant = (index: number) => {
        setProductVariants(
            productVariants.filter((item, idx) => idx !== index),
        );
        setVariantLength((prev) => --prev);
    };

    return (
        product && (
            <section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-muted/40">
                <div className="mx-auto grid max-w-screen flex-1 auto-rows-max gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={'/admin/products'}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                        </Link>
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Chỉnh sửa sản phẩm
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Link href={'/admin/products'}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="min-w-[100px]"
                                >
                                    Quay lại
                                </Button>
                            </Link>
                            {loading ? (
                                <Button
                                    disabled
                                    size="sm"
                                    className="min-w-[100px]"
                                >
                                    <ReloadIcon className="mr-2 animate-spin" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    size="sm"
                                    className="min-w-[100px]"
                                >
                                    Lưu
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin sản phẩm</CardTitle>
                                    <CardDescription>
                                        Chỉnh sửa sản phẩm
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">
                                                Tên sản phẩm
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                className="w-full"
                                                autoComplete="off"
                                                value={productName}
                                                onChange={(e) =>
                                                    setProductName(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="flex justify-between gap-3">
                                                <Label htmlFor="main-image">
                                                    Ảnh thông số
                                                </Label>

                                                <Button
                                                    size="sm"
                                                    className="min-w-[80px]"
                                                >
                                                    <Label htmlFor="main-image">
                                                        Chọn ảnh
                                                    </Label>
                                                </Button>
                                            </div>
                                            <Input
                                                id="main-image"
                                                type="file"
                                                onChange={(e) =>
                                                    setMainImageFile(
                                                        e.target?.files?.[0],
                                                    )
                                                }
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <Label
                                                htmlFor="main-image"
                                                className="flex justify-center"
                                            >
                                                {mainImageFile ? (
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            mainImageFile,
                                                        )}
                                                        width={1080}
                                                        height={1080}
                                                        quality={100}
                                                        alt="ảnh thông số"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={mainImage}
                                                        width={1080}
                                                        height={1080}
                                                        quality={100}
                                                        alt="ảnh thông số"
                                                    />
                                                )}
                                            </Label>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description">
                                                Mô tả
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-32"
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="warranties">
                                                Bảo hành
                                            </Label>
                                            <Textarea
                                                id="warranties"
                                                value={warranties}
                                                onChange={(e) =>
                                                    setWarranties(
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-32"
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="promotions">
                                                Khuyến mãi
                                            </Label>
                                            <Textarea
                                                id="promotions"
                                                value={promotions}
                                                onChange={(e) =>
                                                    setPromotions(
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-32"
                                            />
                                        </div>
                                        {!product?.product_options[0]?.options
                                            ?.length && (
                                                <ProductVariantCard
                                                    product={
                                                        product?.product_options[0]
                                                    }
                                                />
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sản phẩm nổi bật</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="label">
                                                Nhãn giảm giá
                                            </Label>
                                            <Input
                                                id="label"
                                                type="text"
                                                autoComplete="off"
                                                className="w-full"
                                                value={label}
                                                onChange={(e) =>
                                                    setLabel(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Giá</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="grid col-span-12 gap-3">
                                            <Input
                                                id="price"
                                                type="number"
                                                className="w-full"
                                                onChange={(e) =>
                                                    setPrice(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                value={price}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh mục</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="grid col-span-12 gap-3">
                                            <Label htmlFor="category">
                                                Chọn danh mục sản phẩm
                                            </Label>
                                            <Select
                                                value={selectedCategory}
                                                onValueChange={
                                                    setSelectedCategory
                                                }
                                            >
                                                <SelectTrigger
                                                    id="category"
                                                    className="bg-popover capitalize"
                                                >
                                                    <SelectValue className="capitalize" />
                                                </SelectTrigger>
                                                <SelectContent className="capitalize">
                                                    {categories.map((cate) => (
                                                        <SelectItem
                                                            key={cate.id}
                                                            value={cate.slug}
                                                        >
                                                            {cate.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thương hiệu</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="grid col-span-12 gap-3">
                                            <Label htmlFor="brand">
                                                Chọn thương hiệu sản phẩm
                                            </Label>
                                            <Select
                                                value={selectedBrand}
                                                onValueChange={setSelectedBrand}
                                            >
                                                <SelectTrigger
                                                    id="brand"
                                                    className="bg-popover capitalize"
                                                >
                                                    <SelectValue className="capitalize" />
                                                </SelectTrigger>
                                                <SelectContent className="capitalize">
                                                    {brands
                                                        .filter(
                                                            (item) =>
                                                                !item.is_deleted,
                                                        )
                                                        .map((brand) => (
                                                            <SelectItem
                                                                key={brand.id}
                                                                value={
                                                                    brand.slug
                                                                }
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
                        </div>
                    </div>
                    {product?.product_options[0]?.options?.length > 0 && (
                        <>
                            <div className="grid gap-4 md:grid-cols-3 lg:gap-8">
                                {product?.product_options?.map(
                                    (productVariant) => (
                                        <div
                                            key={productVariant.id}
                                            className="grid auto-rows-max items-start gap-4 lg:gap-8"
                                        >
                                            <ProductVariantCard
                                                product={productVariant}
                                            />
                                        </div>
                                    ),
                                )}
                                {product && (
                                    <>
                                        {Array.from({
                                            length: variantLength,
                                        }).map((_, index) => (
                                            <AddProductVariantCard
                                                key={index}
                                                product={product}
                                                variantIndex={index}
                                                handleDeleteVariant={
                                                    handleDeleteVariant
                                                }
                                                handleAddVariant={
                                                    handleAddVariant
                                                }
                                            />
                                        ))}
                                        <div
                                            onClick={() =>
                                                setVariantLength(
                                                    (prev) => ++prev,
                                                )
                                            }
                                            className="flex aspect-square bg-popover items-center justify-center rounded-md border border-dashed"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Plus className="h-4 w-4 text-muted-foreground" />
                                                <p>Thêm biến thể</p>
                                            </div>
                                            <span className="sr-only">Add</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    <div className="flex items-center justify-center gap-2 md:hidden">
                        {loading ? (
                            <Button
                                disabled
                                size="sm"
                                className="min-w-[100px]"
                            >
                                <ReloadIcon className="mr-2 min-w-[100px] animate-spin" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                size="sm"
                                className="min-w-[100px]"
                            >
                                Lưu
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        )
    );
}
