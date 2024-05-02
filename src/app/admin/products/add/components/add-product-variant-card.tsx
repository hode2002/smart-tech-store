'use client';

import {
    ProductDetailType,
    ProductImagesType,
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
import AddTechnicalSpecs from '@/app/admin/products/add/components/add-technical-specs';
import { arraySpecsToObject, translateSpecs } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import adminApiRequest, {
    CreateProductOptionResponseType,
    CreateProductOptionType,
    OptionValueType,
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { ReloadIcon } from '@radix-ui/react-icons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Props = {
    product: ProductDetailType;
    handleAddVariant: (newVariant: CreateProductOptionType) => void;
    handleDeleteVariant: (index: number) => void;
    variantIndex: number;
};
const AddProductVariantCard = (props: Props) => {
    const token = useAppSelector((state) => state.auth.accessToken);

    const { product, handleAddVariant, variantIndex, handleDeleteVariant } =
        props;
    const [optionValues, setOptionValues] = useState<OptionValueType[]>([]);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isSale, setIsSale] = useState<boolean>(false);
    const [sku, setSku] = useState<string>('');
    const [stock, setStock] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [priceModifier, setPriceModifier] = useState<number>(0);
    const [thumbnailFile, setThumbnailFile] = useState<File>();
    const [labelImageFile, setLabelImageFile] = useState<File>();
    const [otherImageFiles, setOtherImageFiles] = useState<FileList>();
    const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecsItem[]>(
        [],
    );
    const [color, setColor] = useState<string>('');
    const [size, setSize] = useState<string>('');

    useEffect(() => {
        adminApiRequest.getOptionValue(token).then((res) => {
            setOptionValues(res.data);
        });
    }, [token]);

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
        )) as UploadSingleFileResponseType;
        const thumbnailS3 = thumbnailResponse.data?.key;

        const labelImageResponse = (await adminApiRequest.uploadFile(
            token,
            labelImageFile as File,
        )) as UploadSingleFileResponseType;
        const labelImageS3 = labelImageResponse.data?.key;

        const otherImagesS3: ProductImagesType = [];
        const otherImageResponse = (await adminApiRequest.uploadMultipleFiles(
            token,
            otherImageFiles as FileList,
        )) as UploadMultipleFilesResponseType;
        otherImageResponse.data.map((res) => {
            return otherImagesS3.push({
                image_url: res.key,
                image_alt_text: sku.toLowerCase().replaceAll('-', ' '),
            });
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
            product_option_value: optionValues.map((option) => {
                return option.name === 'Màu sắc'
                    ? {
                          option_id: option.id,
                          value: color,
                      }
                    : {
                          option_id: option.id,
                          value: size,
                      };
            }),
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
        handleAddVariant(newVariant);
    };

    const handleDelete = () => {
        handleDeleteVariant(variantIndex);
    };

    return (
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <Accordion defaultValue="item-1" type="single" collapsible>
                    <AccordionItem value="item-1">
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
                                            onChange={(e) =>
                                                setSku(e.target.value)
                                            }
                                            value={sku}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Màu sắc</Label>
                                        <Input
                                            type="text"
                                            className="w-full"
                                            onChange={(e) =>
                                                setColor(e.target.value)
                                            }
                                            value={color}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Kích thước</Label>
                                        <Input
                                            type="text"
                                            className="w-full"
                                            onChange={(e) =>
                                                setSize(e.target.value)
                                            }
                                            value={size}
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
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                className="min-w-[100px]"
                                            >
                                                Xóa
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Xóa biến thể này?
                                                </AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Quay lại
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                >
                                                    Xác nhận
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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
