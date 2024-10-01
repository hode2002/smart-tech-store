'use client';

import {
    GetProductDetailResponseType,
    ProductDetailType,
} from '@/schemaValidations/product.schema';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
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
import { Editor as TinyMCEEditor } from 'tinymce';
import dynamic from 'next/dynamic';

const CustomEditor = dynamic(() => import('@/components/custom-editor'), {
    ssr: false,
});

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

    const editorRef = useRef<TinyMCEEditor | null>(null);

    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        let mainImageS3: string | undefined = undefined;

        if (mainImageFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                mainImageFile,
                '/Products/' + product?.category.slug,
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
            descriptions: [{ content: editorRef.current!.getContent() }],
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
                        <div className="items-center gap-2 ml-auto flex">
                            <Link
                                className="hidden md:block"
                                href={'/admin/products'}
                            >
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
                                            <div className="flex items-center justify-between gap-3">
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
                                            <CustomEditor
                                                initialValue={
                                                    product?.descriptions[0]
                                                        .content
                                                }
                                                onInit={(evt, editor) =>
                                                    (editorRef.current = editor)
                                                }
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
                                                product={product}
                                                productOption={
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
                                                product={product}
                                                productOption={productVariant}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        )
    );
}
