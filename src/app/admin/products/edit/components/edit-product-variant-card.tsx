'use client';

import {
    ProductDetailType,
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
import { toast } from '@/components/ui/use-toast';
import adminApiRequest, {
    UpdateProductOptionResponseType,
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { ReloadIcon } from '@radix-ui/react-icons';
import EditTechnicalSpecsCard from '@/app/admin/products/edit/components/edit-technical-specs-card';

type Props = {
    product: ProductDetailType;
    productVariant: ProductOptionType;
};
const EditProductVariantCard = (props: Props) => {
    const token = useAppSelector((state) => state.auth.accessToken);

    const { product, productVariant } = props;
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isSale, setIsSale] = useState<boolean>(false);
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
        stock,
        priceModifier,
        discount,
        isSale,
        isActive,
        thumbnailFile,
        labelImageFile,
        otherImageFiles,
        technicalSpecs,
        productVariant.discount,
        productVariant.is_deleted,
        productVariant.is_sale,
        productVariant.label_image,
        productVariant.price_modifier,
        productVariant.product_images,
        productVariant.sku,
        productVariant.stock,
        productVariant.technical_specs,
        productVariant.thumbnail,
    ]);

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
                '/Products/' + product.category.slug,
            )) as UploadSingleFileResponseType;
            thumbnailS3 = response.data?.key;
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
                '/Products/' + product.category.slug,
            )) as UploadMultipleFilesResponseType;
            response.data.map((res) => {
                return otherImagesS3.push({
                    image_url: res.key,
                    image_alt_text: productVariant.sku
                        .toLowerCase()
                        .replaceAll('-', ' '),
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
            technical_specs: technicalSpecs.map((item) => ({
                key: item.name,
                value: item.value,
            })),
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
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card
                className={`${product?.product_options[0]?.options?.length > 1 ? '' : 'border-0 shadow-none'}`}
            >
                <Accordion
                    defaultValue={productVariant.sku}
                    type="single"
                    collapsible
                >
                    <AccordionItem value={productVariant.sku}>
                        {product?.product_options[0]?.options?.length > 1 && (
                            <CardHeader>
                                <AccordionTrigger>
                                    <CardTitle>
                                        Biến thể {productVariant.sku}
                                    </CardTitle>
                                </AccordionTrigger>
                                <CardDescription>
                                    Chỉnh sửa biến thể sản phẩm
                                </CardDescription>
                            </CardHeader>
                        )}
                        <AccordionContent>
                            <CardContent
                                className={`${product?.product_options[0]?.options?.length > 1 ? '' : 'px-0'}`}
                            >
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label>SKU</Label>
                                        <Input
                                            type="text"
                                            className="w-full"
                                            value={productVariant.sku}
                                            disabled
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Số lượng tồn</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="100"
                                            className="w-full"
                                            onChange={(e) =>
                                                setStock(Number(e.target.value))
                                            }
                                            value={stock}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Giá điều chỉnh</Label>
                                        <Input
                                            type="number"
                                            min="0"
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
                                            <Label>Ảnh bìa</Label>
                                            <Button
                                                size="sm"
                                                className="min-w-[80px]"
                                            >
                                                <Label
                                                    htmlFor={`thumbnail-${productVariant.sku}`}
                                                >
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <Input
                                            id={`thumbnail-${productVariant.sku}`}
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
                                        <div className="flex justify-between items-center gap-3">
                                            <Label>Hình ảnh khác</Label>
                                            <Button
                                                size="sm"
                                                className="min-w-[80px]"
                                            >
                                                <Label
                                                    htmlFor={`other-images-${productVariant.sku}`}
                                                >
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input
                                                id={`other-images-${productVariant.sku}`}
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

                                            {otherImageFiles
                                                ? Array.from(
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
                                                  ))
                                                : otherImages?.map((image) => (
                                                      <button key={image.id}>
                                                          <Image
                                                              alt={
                                                                  image.image_alt_text
                                                              }
                                                              className="aspect-square w-full rounded-md object-cover"
                                                              height="300"
                                                              width="300"
                                                              src={
                                                                  image.image_url
                                                              }
                                                          />
                                                      </button>
                                                  ))}
                                            <Label
                                                htmlFor={`other-images-${productVariant.sku}`}
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
                                            <Label
                                                htmlFor={`product-sale-${productVariant.sku}`}
                                            >
                                                Sản phẩm nổi bật
                                            </Label>
                                            <Switch
                                                id={`product-sale-${productVariant.sku}`}
                                                checked={isSale}
                                                onCheckedChange={setIsSale}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>% Giảm</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
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
                                            <Label>Ảnh</Label>
                                            <Button
                                                size="sm"
                                                className="min-w-[80px]"
                                            >
                                                <Label
                                                    htmlFor={`label-image-${productVariant.sku}`}
                                                >
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <Input
                                            id={`label-image-${productVariant.sku}`}
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
                                        <Label>Trạng thái</Label>
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
                                            <SelectTrigger aria-label="Select status">
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
                                    <div className="grid gap-3">
                                        <EditTechnicalSpecsCard
                                            technicalSpecs={technicalSpecs}
                                            setTechnicalSpecs={
                                                setTechnicalSpecs
                                            }
                                        />
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
        </div>
    );
};

export default EditProductVariantCard;
