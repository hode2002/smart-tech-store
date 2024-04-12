import Image from 'next/image';
import Link from 'next/link';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';

export default function ProductCard() {
    return (
        <div className="my-4 max-w-[300px]">
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="bg-card hover:shadow-2xl hover:cursor-pointer hover:scale-[1.01] transition-all duration-300 border-[1px] border-[#ccc] rounded-md px-2 py-3 max-w-[300px] shadow-md m-3 flex flex-col justify-between">
                        <Link
                            href={`/smartphone/samsung-galaxy-z-flip4-5g-128gb`}
                            className="relative flex flex-col justify-center items-center gap-2"
                        >
                            <Image
                                height={70}
                                width={70}
                                src={
                                    'https://res.cloudinary.com/dwmhohds0/image/upload/v1685348575/Shopping-Online/sticker/sticker-new-Moi.png'
                                }
                                alt="product sticker"
                                className="absolute top-2 left-3 z-10"
                            />

                            <div>
                                <Image
                                    height={500}
                                    width={200}
                                    src={
                                        'https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2022/12/10/image-removebg-preview-2022-12-10t104204-819.png'
                                    }
                                    alt={'product.name'}
                                    className="hover:scale-[1.05] transition-all duration-300"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button className="">128GB</Button>
                                <Button variant={'outline'}>256GB</Button>
                                <Button variant={'outline'}>512GB</Button>
                            </div>

                            <div>
                                <p className="text-center">
                                    {'Samsung Galaxy Z Flip4 5G 128GB'}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <p className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm h-9 px-4 py-2">
                                    {'6.7"'}
                                </p>
                                <p className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm h-9 px-4 py-2">
                                    Super Retina XDR
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 capitalize">
                                <div className="flex gap-3 mt-2 justify-center items-center">
                                    <p className="text-[#E83A45] font-bold text-[18px]">
                                        {/* {'Tạm hết hàng'} */}
                                        41.500.000đ
                                    </p>
                                    {/* {'Tạm hết hàng'} */}
                                    <p className="line-through text-[14px]">
                                        44.500.000đ
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-start items-center gap-2">
                                <span className="font-bold"> 4.7 </span>
                                <div className="inline-flex items-center">
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-yellow-400 cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-yellow-400 cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-yellow-400 cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-yellow-400 cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-gray-500 cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                </div>
                                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                                    (134)
                                </p>
                            </div>
                        </Link>

                        <Button variant={'default'} className="px-2 py-3 my-4">
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem inset>
                        <li className="p-1 block">
                            <p className="text-dark dark:text-white w-[90%] text-[14px] opacity-[0.85] list-item">
                                Chip Snapdragon 8 Gen 3 for Galaxy RAM: 12 GB
                            </p>
                        </li>
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        <li className="p-1 block">
                            <p className="text-dark dark:text-white w-[90%] text-[14px] opacity-[0.85] list-item">
                                Dung lượng: 128 GB
                            </p>
                        </li>
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        <li className="p-1 block">
                            <p className="text-dark dark:text-white w-[90%] text-[14px] opacity-[0.85] list-item">
                                Camera sau: Chính 200 MP & Phụ 50 MP, 12 MP, 10
                                MP
                            </p>
                        </li>
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        <li className="p-1 block">
                            <p className="text-dark dark:text-white w-[90%] text-[14px] opacity-[0.85] list-item">
                                Camera trước: 12 MP
                            </p>
                        </li>
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        <li className="p-1 block">
                            <p className="text-dark dark:text-white w-[90%] text-[14px] opacity-[0.85] list-item">
                                Pin 5000 mAh, Sạc 45 W
                            </p>
                        </li>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}
