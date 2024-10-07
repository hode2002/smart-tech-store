'use client';
import {
    ProductImagesType,
    TechnicalSpecsItem,
} from '@/schemaValidations/product.schema';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, CircleHelp, Upload } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { Editor as TinyMCEEditor } from 'tinymce';
import dynamic from 'next/dynamic';
import TechnicalSpecsCard from '@/app/admin/products/add/components/technical-specs-card';

const CustomEditor = dynamic(() => import('@/components/custom-editor'), {
    ssr: false,
});

const CustomJoyride = dynamic(() => import('@/components/Joyride'), {
    ssr: false,
});

const steps = [
    {
        target: '#introduce',
        content: 'Hướng dẫn tạo sản phẩm.',
    },
    {
        target: '#product',
        content: 'Nhập thông tin chung.',
    },
    {
        target: '#stock',
        content: 'Quản lý số lượng tồn.',
    },
    {
        target: '#product-sale',
        content:
            'Sản phẩm nổi bật sẽ được ưu tiên xuất hiện trên trang chủ website',
    },
    {
        target: '#cate',
        content: 'Chọn danh mục sản phẩm',
    },
    {
        target: '#brand',
        content: 'Chọn thương hiệu sản phẩm',
    },
    {
        target: '#technical-specs',
        content: 'Thêm các thông số kỹ thuật cho sản phẩm.',
    },
    {
        target: '#save-btn',
        content: 'Cuối cùng ấn lưu để tạo sản phẩm',
    },
];

export default function AddSimpleProduct() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const router = useRouter();
    const [help, setHelp] = useState(false);

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
        let mainImageS3: string = '';
        let thumbnailS3: string = '';
        let labelImageS3: string = '';
        const otherImagesS3: ProductImagesType = [];

        if (mainImageFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                mainImageFile,
                '/Products/' + selectedCategory,
            )) as UploadSingleFileResponseType;
            mainImageS3 = response.data?.key;
        }
        if (thumbnailFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                thumbnailFile,
                '/Products/' + selectedCategory,
            )) as UploadSingleFileResponseType;
            thumbnailS3 = response.data.key;
        }
        if (labelImageFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                labelImageFile,
                '/Products/Labels',
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
            warranties: warranties.split(' | '),
            promotions: promotions.split(' | '),
            descriptions: [{ content: editorRef.current!.getContent() }],
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
                    technical_specs: technicalSpecs.map((spec) => ({
                        key: spec.name,
                        value: spec.value,
                    })),
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

    return (
        <>
            <CustomJoyride steps={steps} run={help} setRun={setHelp} />
            <section
                id="introduce"
                className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-muted/40"
            >
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
                        <h1 className="flex-1 flex justify-center items-center gap-2 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Thêm sản phẩm
                            <CircleHelp
                                className="cursor-pointer"
                                onClick={() => setHelp(!help)}
                            />
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
                                    id="save-btn"
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
                        <div
                            id="product"
                            className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8"
                        >
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
                                                    Array.from(
                                                        otherImageFiles,
                                                    ).map((file, index) => (
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
                                                    ))}
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
                                            <CustomEditor
                                                initialValue={''}
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
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                            <Card id="stock">
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
                                                    setPrice(
                                                        Number(e.target.value),
                                                    )
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
                                                    setStock(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                value={stock}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card id="product-sale">
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
                                            <Label htmlFor="discount">
                                                % Giảm
                                            </Label>
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
                            <Card id="cate">
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
                            <Card id="brand">
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
                                                    isActive
                                                        ? 'inactive'
                                                        : 'active'
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
                            <TechnicalSpecsCard
                                setTechnicalSpecs={setTechnicalSpecs}
                            />
                        </div>
                    </div>
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
        </>
    );
}
