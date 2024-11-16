'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import adminApiRequest, {
    CreateProductBodyType,
    CreateProductResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { useAppSelector } from '@/lib/store';
import { CategoryType } from '@/schemaValidations/category.schema';
import { BrandType } from '@/schemaValidations/brand.schema';
import AddProductVariantCard from '@/app/admin/products/add/components/add-product-variant-card';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';
import { ProductDetailType } from '@/schemaValidations/product.schema';
import SelectAttributeCard from '@/app/admin/products/add/components/select-attribute-card';
import SelectCategoryCard from '@/app/admin/products/add/components/select-category-card';
import SelectBrandCard from '@/app/admin/products/add/components/select-brand-card';
import { Badge } from '@/components/ui/badge';
import { Editor as TinyMCEEditor } from 'tinymce';
import dynamic from 'next/dynamic';

const CustomEditor = dynamic(() => import('@/components/custom-editor'), {
    ssr: false,
});

export type AttributeType = { id: string; name: string; value: string };

export default function AddVariantProduct() {
    const token = useAppSelector((state) => state.auth.accessToken);

    const [productName, setProductName] = useState<string>('');
    const [label, setLabel] = useState<string>('Trả góp 0%');
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>();
    const [selectedBrand, setSelectedBrand] = useState<BrandType>();
    const [warranties, setWarranties] = useState<string>('');
    const [promotions, setPromotions] = useState<string>('');
    const [mainImageFile, setMainImageFile] = useState<File | undefined>();
    const [price, setPrice] = useState<number>(0);

    const editorRef = useRef<TinyMCEEditor | null>(null);

    const [product, setProduct] = useState<ProductDetailType>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);

        const uploadResponse = (await adminApiRequest.uploadFile(
            token,
            mainImageFile as File,
            '/Products/' + selectedCategory,
        )) as UploadSingleFileResponseType;
        const mainImageS3 = uploadResponse.data?.key;

        const newProduct: CreateProductBodyType = {
            main_image: mainImageS3,
            name: productName,
            price,
            label: label,
            brand_id: selectedBrand!.id,
            category_id: selectedCategory!.id,
            warranties: warranties.split(' | '),
            promotions: promotions.split(' | '),
            descriptions: [{ content: editorRef.current!.getContent() }],
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
            setProduct(response.data);
        }
    };
    const [attributes, setAttributes] = useState<AttributeType[]>([]);
    const [skuList, setSkuList] = useState<string[]>([]);

    const combineAttribute = useCallback((originArr: string[][]) => {
        return originArr.reduce(
            (expectedArr, currArr: string[]) => {
                return expectedArr.flatMap((prevArr: string[]) =>
                    currArr.map((currValue) => [...prevArr, currValue]),
                );
            },
            [[]] as string[][],
        );
    }, []);

    const handleCreateProductAttribute = () => {
        const results = attributes.map((attr) => {
            return attr.value.split(' | ');
        });
        const productAttrData = combineAttribute(results).map((combination) =>
            combination.join('-'),
        );
        setSkuList(productAttrData);
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
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge
                                        variant="default"
                                        className="font-extrabold"
                                    >
                                        1
                                    </Badge>
                                    <span className="font-extrabold">
                                        Thông tin chung
                                    </span>
                                </CardTitle>
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
                                                    className="rounded-md"
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
                                            placeholder="Các giá trị cách nhau bằng |"
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
                                            placeholder="Các giá trị cách nhau bằng |"
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
                                                setPrice(Number(e.target.value))
                                            }
                                            value={price}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <SelectCategoryCard
                            setSelectedCategory={setSelectedCategory}
                        />
                        <SelectBrandCard setSelectedBrand={setSelectedBrand} />

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
                </div>

                {product && (
                    <SelectAttributeCard
                        attributes={attributes}
                        setAttributes={setAttributes}
                        handleCreateProductAttribute={
                            handleCreateProductAttribute
                        }
                    />
                )}

                {product && skuList && skuList.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3 lg:gap-8">
                        {skuList.map((sku) => (
                            <AddProductVariantCard
                                key={sku}
                                sku={sku}
                                attributes={attributes}
                                product={product}
                            />
                        ))}
                    </div>
                )}

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
