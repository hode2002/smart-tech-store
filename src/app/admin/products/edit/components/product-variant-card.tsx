'use client';

import {
    ProductImagesType,
    ProductOptionType,
    TechnicalSpecsItem,
} from '@/schemaValidations/product.schema';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/lib/store';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import TechnicalSpecs from '@/app/admin/products/edit/components/technical-specs';
import { translateSpecs } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import adminApiRequest, {
    UpdateProductOptionResponseType,
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { ReloadIcon } from '@radix-ui/react-icons';

type Props = {
    product: ProductOptionType;
};
const ProductVariantCard = (props: Props) => {
    const token = useAppSelector((state) => state.auth.accessToken);

    const productVariant = props.product;
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isSale, setIsSale] = useState<boolean>(false);
    const [sku, setSku] = useState<string>('');
    const [stock, setStock] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [priceModifier, setPriceModifier] = useState<number>(0);
    const [thumbnail, setThumbnail] = useState<string>('');
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
    const [labelImage, setLabelImage] = useState<string>('');
    const [labelImageFile, setLabelImageFile] = useState<File | undefined>();
    const [otherImages, setOtherImages] = useState<ProductImagesType>();
    const [otherImageFiles, setOtherImageFiles] = useState<
        FileList | undefined
    >();
    const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecsItem[]>(
        [],
    );

    useEffect(() => {
        setSku(productVariant.sku);
        setStock(productVariant.stock);
        setPriceModifier(productVariant.price_modifier);
        setDiscount(productVariant.discount);
        setIsSale(productVariant.is_sale as boolean);
        setIsActive(productVariant.is_deleted as boolean);
        setLabelImage(productVariant.label_image);
        setThumbnail(productVariant.thumbnail);
        setOtherImages(productVariant.product_images);
        setTechnicalSpecs(productVariant.technical_specs);
    }, [productVariant]);

    const [hasChanges, setHasChanges] = useState<boolean>(false);
    useEffect(() => {
        const initialProduct = {
            sku: productVariant.sku,
            stock: productVariant.stock,
            priceModifier: productVariant.price_modifier,
            discount: productVariant.discount,
            isSale: productVariant.is_sale as boolean,
            isActive: productVariant.is_deleted as boolean,
            thumbnail: productVariant.thumbnail,
            labelImage: productVariant.label_image,
            otherImages: productVariant.product_images,
            technicalSpecs: productVariant.technical_specs,
        };

        const currentProduct = {
            sku,
            stock,
            priceModifier,
            discount,
            isSale,
            isActive,
            thumbnailFile,
            labelImageFile,
            otherImageFiles,
            technicalSpecs,
        };

        setHasChanges(
            JSON.stringify(initialProduct) !== JSON.stringify(currentProduct),
        );
    }, [
        sku,
        stock,
        priceModifier,
        discount,
        isSale,
        isActive,
        thumbnailFile,
        labelImageFile,
        otherImageFiles,
        technicalSpecs,
    ]);

    function arraySpecsToObject(array: TechnicalSpecsItem[]): {
        [key: string]: any;
    } {
        return array.reduce((result: any, specs) => {
            result[specs.name] = specs.value;
            return result;
        }, {} as TechnicalSpecsItem);
    }

    const handleUpdateTechnicalSpecs = (updatedSpecs: TechnicalSpecsItem[]) => {
        setTechnicalSpecs(updatedSpecs);
        toast({
            title: 'Cập nhật thành công',
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

    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        let thumbnailS3: string | undefined = undefined;
        let labelImageS3: string | undefined = undefined;
        const otherImagesS3: ProductImagesType = [];

        if (thumbnailFile) {
            const response = (await adminApiRequest.uploadFile(
                token,
                thumbnailFile,
            )) as UploadSingleFileResponseType;
            thumbnailS3 = response.data?.key;
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
        const productEdited = {
            ...(thumbnailS3 && { thumbnail: thumbnailS3 }),
            ...(labelImageS3 && { label_image: labelImageS3 }),
            ...(otherImagesS3 &&
                otherImagesS3?.length > 0 && { product_images: otherImagesS3 }),
            price_modifier: priceModifier,
            stock,
            discount,
            is_deleted: isActive,
            is_sale: isSale,
            technical_specs: arraySpecsToObject(translateSpecs(technicalSpecs)),
        };

        const response = (await adminApiRequest.updateProductOption(
            token,
            productVariant.id,
            productEdited,
        )) as UpdateProductOptionResponseType;
        setLoading(false);
        if (response?.statusCode === 200) {
            setHasChanges(false);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    return (
        <Card>
            <Accordion type="single" defaultValue="item-1" collapsible>
                <AccordionItem value="item-1">
                    {productVariant?.options?.length > 0 && (
                        <CardHeader>
                            <AccordionTrigger>
                                <CardTitle>Biến thể {sku}</CardTitle>
                            </AccordionTrigger>
                            <CardDescription>
                                Chỉnh sửa biến thể sản phẩm
                            </CardDescription>
                        </CardHeader>
                    )}
                    <AccordionContent>
                        <CardContent>
                            <div className="grid gap-6 pt-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        readOnly
                                        disabled
                                        type="text"
                                        className="w-full"
                                        onChange={(e) => setSku(e.target.value)}
                                        value={sku}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="stock">Số lượng tồn</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        className="w-full"
                                        onChange={(e) =>
                                            setStock(Number(e.target.value))
                                        }
                                        value={stock}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="priceModifier">
                                        Giá điều chỉnh
                                    </Label>
                                    <Input
                                        id="priceModifier"
                                        type="number"
                                        className="w-full"
                                        value={priceModifier}
                                        onChange={(e) =>
                                            setPriceModifier(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex justify-between items-center gap-3">
                                        <Label>Hình ảnh sản phẩm</Label>
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
                                    <Label
                                        htmlFor="thumbnail"
                                        className="flex justify-center"
                                    >
                                        {thumbnailFile ? (
                                            <Image
                                                alt="Product thumbnail"
                                                className="w-full rounded-md object-contain"
                                                height="1000"
                                                width="1000"
                                                src={URL.createObjectURL(
                                                    thumbnailFile,
                                                )}
                                            />
                                        ) : (
                                            thumbnail && (
                                                <Image
                                                    alt="Product thumbnail"
                                                    className="aspect-square w-full rounded-md object-contain"
                                                    height="1000"
                                                    width="1000"
                                                    src={thumbnail}
                                                />
                                            )
                                        )}
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            id="other-images"
                                            type="file"
                                            onChange={(e) =>
                                                setOtherImageFiles(
                                                    e.target?.files as FileList,
                                                )
                                            }
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                        />

                                        {otherImageFiles
                                            ? Array.from(otherImageFiles).map(
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
                                            )
                                            : otherImages?.map((image) => (
                                                <button key={image.id}>
                                                    <Image
                                                        alt={
                                                            image.image_alt_text
                                                        }
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        height="300"
                                                        width="300"
                                                        src={image.image_url}
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
                                            setDiscount(Number(e.target.value))
                                        }
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex justify-between items-center gap-3">
                                        <Label>Ảnh</Label>
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
                                    <Label
                                        htmlFor="label-image"
                                        className="flex justify-start"
                                    >
                                        {labelImageFile ? (
                                            <Image
                                                alt="Label image"
                                                className="aspect-square rounded-md object-cover"
                                                height="85"
                                                width="85"
                                                src={URL.createObjectURL(
                                                    labelImageFile,
                                                )}
                                            />
                                        ) : (
                                            labelImage && (
                                                <Image
                                                    alt="Label image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="85"
                                                    width="85"
                                                    src={labelImage}
                                                />
                                            )
                                        )}
                                    </Label>
                                </div>
                                <div className="grid gap-3">
                                    <TechnicalSpecs
                                        technicalSpecs={
                                            productVariant.technical_specs
                                        }
                                        handleUpdateTechnicalSpecs={
                                            handleUpdateTechnicalSpecs
                                        }
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="status">Trạng thái</Label>
                                    <Select
                                        value={isActive ? 'inactive' : 'active'}
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
                        <CardFooter>
                            <div className="flex items-center justify-end gap-2 w-full">
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
                                        disabled={!hasChanges}
                                    >
                                        Lưu
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
};

export default ProductVariantCard;
