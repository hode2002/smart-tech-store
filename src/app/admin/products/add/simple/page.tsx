'use client';

import {
    ProductImagesType,
    TechnicalSpecsItem,
} from '@/schemaValidations/product.schema';
import React, { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Upload } from 'lucide-react';
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
    CreateProductBodyType,
    CreateProductResponseType,
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { useAppSelector } from '@/lib/store';
import {
    CategoryResponseType,
    CategoryType,
} from '@/schemaValidations/category.schema';
import { BrandResponseType, BrandType } from '@/schemaValidations/brand.schema';
import categoryApiRequest from '@/apiRequests/category';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Switch } from '@/components/ui/switch';
import AddTechnicalSpecs from '@/app/admin/products/add/components/add-technical-specs';
import { arraySpecsToObject, translateSpecs } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AddSimpleProduct() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const router = useRouter();

    const [productName, setProductName] = useState<string>('');
    const [label, setLabel] = useState<string>('Trả góp 0%');
    const [selectedCategory, setSelectedCategory] =
        useState<string>('smartphone');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [warranties, setWarranties] = useState<string>('');
    const [promotions, setPromotions] = useState<string>('');
    const [mainImageFile, setMainImageFile] = useState<File | undefined>();
    const [price, setPrice] = useState<number>(0);

    const [isActive, setIsActive] = useState<boolean>(false);
    const [isSale, setIsSale] = useState<boolean>(false);
    const [sku, setSku] = useState<string>('');
    const [stock, setStock] = useState<number>(1);
    const [discount, setDiscount] = useState<number>(0);
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
    const [labelImageFile, setLabelImageFile] = useState<File | undefined>();
    const [otherImageFiles, setOtherImageFiles] = useState<
        FileList | undefined
    >();
    const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecsItem[]>(
        [],
    );

    // const fetchProduct = useCallback(async () => {
    //     const response = (await adminApiRequest.getProductById(
    //         token,
    //         params.id,
    //     )) as GetProductDetailResponseType;
    //     return response.data;
    // }, [token, params.id]);

    // useEffect(() => {
    //     fetchProduct().then((data) => {
    //         setSelectedCategory(data.category.slug);
    //         setSelectedBrand(data.brand.slug);
    //         setPromotions(data.promotions.join('###'));
    //         setWarranties(data.warranties.join('###'));
    //         setDescription(
    //             data.descriptions.map((item) => item.content).join('###'),
    //         );
    //         setMainImage(data.main_image);
    //         setProductName(data.name);
    //         setLabel(data.label);
    //         setPrice(data.price);
    //         setProduct(data);
    //     });
    // }, [fetchProduct]);

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
        let mainImageS3: string = '';
        let thumbnailS3: string = '';
        let labelImageS3: string = '';
        const otherImagesS3: ProductImagesType = [];

        if (mainImageFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                mainImageFile,
            )) as UploadSingleFileResponseType;
            mainImageS3 = response.data?.key;
        }
        if (thumbnailFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                thumbnailFile,
            )) as UploadSingleFileResponseType;
            thumbnailS3 = response.data.key;
        }
        if (labelImageFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                labelImageFile,
            )) as UploadSingleFileResponseType;
            labelImageS3 = response.data?.key;
        }
        if (otherImageFiles) {
            const response = (await adminApiRequest.uploadMultipleFiles(
                token,
                otherImageFiles,
            )) as UploadMultipleFilesResponseType;
            response.data.map((res) => {
                return otherImagesS3.push({
                    image_url: res.key,
                    image_alt_text: sku.toLowerCase().replaceAll('-', ' '),
                });
            });
        }
        const newProduct: CreateProductBodyType = {
            main_image: mainImageS3,
            name: productName,
            price,
            label: label,
            brand_id: brands.find((brand) => brand.slug === selectedBrand)
                ?.id as string,
            category_id: categories.find(
                (cate) => cate.slug === selectedCategory,
            )?.id as string,
            warranties: warranties.split('###'),
            promotions: promotions.split('###'),
            descriptions: description
                .split('###')
                .map((item) => ({ content: item })),

            product_options: [
                {
                    sku,
                    thumbnail: thumbnailS3,
                    label_image: labelImageS3,
                    product_images: otherImagesS3,
                    stock,
                    discount,
                    is_deleted: isActive,
                    is_sale: isSale,
                    technical_specs: arraySpecsToObject(
                        translateSpecs(technicalSpecs),
                    ),
                },
            ],
        };

        const response = (await adminApiRequest.createProduct(
            token,
            newProduct,
        )) as CreateProductResponseType;
        setLoading(false);
        if (response?.statusCode === 201) {
            toast({
                title: 'Success',
                description: response.message,
            });
            return router.push('/admin/products');
        }
    };

    const handleAddTechnicalSpecs = (updatedSpecs: TechnicalSpecsItem[]) => {
        setTechnicalSpecs(updatedSpecs);
        toast({
            title: 'Thành công',
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-popover-foreground">
                        {JSON.stringify(
                            arraySpecsToObject(updatedSpecs),
                            null,
                            2,
                        )}
                    </code>
                </pre>
            ),
        });
    };

    return (
        <section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-muted/40">
            <div className="grid max-w-screen flex-1 auto-rows-max gap-4">
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
                        Thêm sản phẩm
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
                                    Thêm mới sản phẩm
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
                                                setProductName(e.target.value)
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
                                        {mainImageFile ? (
                                            <Label
                                                htmlFor="main-image"
                                                className="flex justify-center"
                                            >
                                                <Image
                                                    src={URL.createObjectURL(
                                                        mainImageFile,
                                                    )}
                                                    width={1080}
                                                    height={1080}
                                                    quality={100}
                                                    alt="ảnh thông số"
                                                />
                                            </Label>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                <Label
                                                    htmlFor="main-image"
                                                    className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                                                >
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                    <span className="sr-only">
                                                        Upload
                                                    </span>
                                                </Label>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex justify-between items-center gap-3">
                                            <Label>Ảnh bìa</Label>
                                            <Button
                                                size="sm"
                                                className="min-w-[80px]"
                                            >
                                                <Label htmlFor="thumbnail">
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            onChange={(e) =>
                                                setThumbnailFile(
                                                    e.target?.files?.[0],
                                                )
                                            }
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        {thumbnailFile ? (
                                            <Label
                                                htmlFor="thumbnail"
                                                className="flex justify-center"
                                            >
                                                <Image
                                                    alt="Product thumbnail"
                                                    className="w-full rounded-md object-contain"
                                                    height="1000"
                                                    width="1000"
                                                    src={URL.createObjectURL(
                                                        thumbnailFile,
                                                    )}
                                                />
                                            </Label>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                <Label
                                                    htmlFor="thumbnail"
                                                    className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                                                >
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                    <span className="sr-only">
                                                        Upload
                                                    </span>
                                                </Label>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center gap-3">
                                            <Label>Hình ảnh khác</Label>
                                            <Button
                                                size="sm"
                                                className="min-w-[80px]"
                                            >
                                                <Label htmlFor="other-images">
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input
                                                id="other-images"
                                                type="file"
                                                onChange={(e) =>
                                                    setOtherImageFiles(
                                                        e.target
                                                            ?.files as FileList,
                                                    )
                                                }
                                                className="hidden"
                                                multiple
                                                accept="image/*"
                                            />
                                            {otherImageFiles &&
                                                Array.from(otherImageFiles).map(
                                                    (file, index) => (
                                                        <button key={index}>
                                                            <Image
                                                                alt="Product image"
                                                                className="aspect-square w-full rounded-md object-cover"
                                                                height="300"
                                                                width="300"
                                                                src={URL.createObjectURL(
                                                                    file,
                                                                )}
                                                            />
                                                        </button>
                                                    ),
                                                )}
                                            <Label
                                                htmlFor="other-images"
                                                className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">
                                                    Upload
                                                </span>
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">
                                            Mô tả
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
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
                                                setWarranties(e.target.value)
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
                                                setPromotions(e.target.value)
                                            }
                                            className="min-h-32"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid col-span-12 gap-3">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            type="text"
                                            autoComplete="off"
                                            className="w-full"
                                            onChange={(e) =>
                                                setSku(e.target.value)
                                            }
                                            value={sku}
                                        />
                                    </div>
                                    <div className="grid col-span-12 gap-3">
                                        <Label htmlFor="sku">Giá</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            className="w-full"
                                            onChange={(e) =>
                                                setPrice(Number(e.target.value))
                                            }
                                            value={price}
                                        />
                                    </div>
                                    <div className="grid col-span-12 gap-3">
                                        <Label htmlFor="stock">
                                            Số lượng tồn
                                        </Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            className="w-full"
                                            min="1"
                                            max="100"
                                            onChange={(e) =>
                                                setStock(Number(e.target.value))
                                            }
                                            value={stock}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                                    <div className="grid gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Label htmlFor="product-sale">
                                                Sản phẩm nổi bật
                                            </Label>
                                            <Switch
                                                id="product-sale"
                                                checked={isSale}
                                                onCheckedChange={setIsSale}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="discount">% Giảm</Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            className="w-full"
                                            value={discount}
                                            onChange={(e) =>
                                                setDiscount(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex justify-between items-center gap-3">
                                            <Label htmlFor="label-image">
                                                Ảnh
                                            </Label>
                                            <Button
                                                size="sm"
                                                className="min-w-[80px]"
                                            >
                                                <Label htmlFor="label-image">
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <Input
                                            id="label-image"
                                            type="file"
                                            onChange={(e) =>
                                                setLabelImageFile(
                                                    e.target?.files?.[0],
                                                )
                                            }
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        {labelImageFile ? (
                                            <Label
                                                htmlFor="label-image"
                                                className="flex justify-start"
                                            >
                                                <Image
                                                    alt="Label image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="85"
                                                    width="85"
                                                    src={URL.createObjectURL(
                                                        labelImageFile,
                                                    )}
                                                />
                                            </Label>
                                        ) : (
                                            <Label
                                                htmlFor="label-image"
                                                className="flex aspect-square w-[25%] items-center justify-center rounded-md border border-dashed"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">
                                                    Upload
                                                </span>
                                            </Label>
                                        )}
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
                                            onValueChange={setSelectedCategory}
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid col-span-12 gap-3">
                                        <Select
                                            value={
                                                isActive ? 'inactive' : 'active'
                                            }
                                            onValueChange={(value) => {
                                                value === 'active'
                                                    ? setIsActive(true)
                                                    : setIsActive(false);
                                            }}
                                        >
                                            <SelectTrigger
                                                id="status"
                                                aria-label="Select status"
                                            >
                                                <SelectValue className="capitalize" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="inactive">
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông số kỹ thuật</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid col-span-12 gap-3">
                                        <AddTechnicalSpecs
                                            handleAddTechnicalSpecs={
                                                handleAddTechnicalSpecs
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                    {loading ? (
                        <Button disabled size="sm" className="min-w-[100px]">
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
    );
}