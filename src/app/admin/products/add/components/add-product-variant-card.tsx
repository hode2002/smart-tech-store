'use client';

import {
    ProductDetailType,
    ProductImagesType,
    TechnicalSpecsItem,
} from '@/schemaValidations/product.schema';
import React, { useState } from 'react';

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
import AddTechnicalSpecs from '@/app/admin/products/add/components/add-technical-specs';
import { arraySpecsToObject, translateSpecs } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import adminApiRequest, {
    CreateProductOptionResponseType,
    CreateProductOptionType,
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { ReloadIcon } from '@radix-ui/react-icons';
import { AttributeType } from '@/app/admin/products/add/variant/page';

type Props = {
    sku: string;
    attributes: AttributeType[];
    product: ProductDetailType;
};
const AddProductVariantCard = (props: Props) => {
    const token = useAppSelector((state) => state.auth.accessToken);

    const { sku, attributes, product } = props;
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isSale, setIsSale] = useState<boolean>(false);
    const [stock, setStock] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [priceModifier, setPriceModifier] = useState<number>(0);
    const [thumbnailFile, setThumbnailFile] = useState<File>();
    const [labelImageFile, setLabelImageFile] = useState<File>();
    const [otherImageFiles, setOtherImageFiles] = useState<FileList>();
    const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecsItem[]>(
        [],
    );

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

    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);

        const thumbnailResponse = (await adminApiRequest.uploadFile(
            token,
            thumbnailFile as File,
            '/Products/' + product.category.slug,
        )) as UploadSingleFileResponseType;
        const thumbnailS3 = thumbnailResponse.data?.key;

        const labelImageResponse = (await adminApiRequest.uploadFile(
            token,
            labelImageFile as File,
            '/Products/Labels',
        )) as UploadSingleFileResponseType;
        const labelImageS3 = labelImageResponse.data?.key;

        const otherImagesS3: ProductImagesType = [];
        const otherImageResponse = (await adminApiRequest.uploadMultipleFiles(
            token,
            otherImageFiles as FileList,
            '/Products/' + product.category.slug,
        )) as UploadMultipleFilesResponseType;
        otherImageResponse.data.map((res) => {
            return otherImagesS3.push({
                image_url: res.key,
                image_alt_text: sku.toLowerCase().replaceAll('-', ' '),
            });
        });

        const productOptionValue = attributes.flatMap((attr: AttributeType) => {
            const data: { option_id: string; value: string }[] = [];
            for (const value of attr.value.split(' | ')) {
                if (sku.split('-').includes(value)) {
                    data.push({ option_id: attr.id, value });
                    break;
                }
            }
            return data;
        });

        const newVariant: CreateProductOptionType = {
            sku,
            thumbnail: thumbnailS3,
            label_image: labelImageS3,
            product_images: otherImagesS3,
            price_modifier: priceModifier,
            stock,
            discount,
            is_deleted: isActive,
            is_sale: isSale,
            technical_specs: arraySpecsToObject(translateSpecs(technicalSpecs)),
            product_option_value: productOptionValue,
        };

        const response = (await adminApiRequest.createProductOption(token, {
            product_id: product.id,
            product_options: [newVariant],
        })) as CreateProductOptionResponseType;

        setLoading(false);
        if (response?.statusCode === 201) {
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    return (
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <Accordion defaultValue={sku} type="single" collapsible>
                    <AccordionItem value={sku}>
                        <CardHeader>
                            <AccordionTrigger>
                                <CardTitle>Biến thể {sku}</CardTitle>
                            </AccordionTrigger>
                            <CardDescription>
                                Chỉnh sửa biến thể sản phẩm
                            </CardDescription>
                        </CardHeader>
                        <AccordionContent>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label>SKU</Label>
                                        <Input
                                            type="text"
                                            className="w-full"
                                            value={sku}
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
                                                    htmlFor={`thumbnail-${sku}`}
                                                >
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <Input
                                            id={`thumbnail-${sku}`}
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
                                                htmlFor={`thumbnail-${sku}`}
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
                                                    htmlFor={`thumbnail-${sku}`}
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
                                                <Label
                                                    htmlFor={`other-images-${sku}`}
                                                >
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input
                                                id={`other-images-${sku}`}
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
                                                htmlFor={`other-images-${sku}`}
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
                                                htmlFor={`product-sale-${sku}`}
                                            >
                                                Sản phẩm nổi bật
                                            </Label>
                                            <Switch
                                                id={`product-sale-${sku}`}
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
                                                    htmlFor={`label-image-${sku}`}
                                                >
                                                    Chọn ảnh
                                                </Label>
                                            </Button>
                                        </div>
                                        <Input
                                            id={`label-image-${sku}`}
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
                                                htmlFor={`label-image-${sku}`}
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
                                            <div className="grid grid-cols-3 gap-2">
                                                <Label
                                                    htmlFor={`label-image-${sku}`}
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
                                        <AddTechnicalSpecs
                                            handleAddTechnicalSpecs={
                                                handleAddTechnicalSpecs
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

export default AddProductVariantCard;
