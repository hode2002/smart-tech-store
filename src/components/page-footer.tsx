import Link from 'next/link';

import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export function PageFooter() {
    return (
        <footer className="w-full min-w-[400px] border-t border-border bg-background">
            <div className="bg-popover mt-2 flex flex-col-reverse lg:flex-row container">
                <div className="p-2">
                    <Link
                        href="/"
                        className="hidden md:flex items-center space-x-3 w-[25%] mb-0 md:mb-4"
                    >
                        <Image
                            priority
                            src={'/images/site-logo.png'}
                            width={50}
                            height={50}
                            className="h-auto w-auto rounded-[50%]"
                            alt="Store"
                        />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            Store
                        </span>
                    </Link>
                    <p className="text-center md:text-start">
                        Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <Image
                            priority
                            width={200}
                            height={200}
                            src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/logo-bo-cong-thuong-da-thong-bao1.png"
                            alt="Logo bo cong thuong da thong bao"
                            className="w-auto h-auto w-50 my-2"
                        />
                    </div>
                    <div className="flex justify-between my-4">
                        <div>
                            <i className="fs-2 fa-brands fa-facebook"></i>
                        </div>
                        <div>
                            <i className="fs-2 fa-brands fa-youtube"></i>
                        </div>
                        <div>
                            <i className="fs-2 fa-brands fa-github"></i>
                        </div>
                        <div>
                            <i className="fs-2 fa-brands fa-twitter"></i>
                        </div>
                    </div>
                </div>
                <div className="py-2 px-4 w-full">
                    <div className="flex flex-col md:flex-row text-center md:text-start gap-10 md:gap-0 justify-between">
                        <ul>
                            <h3 className="font-bold text-[18px]">DỊCH VỤ</h3>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chính sách bảo mật thông tin cá nhân
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chính sách bảo mật thanh toán
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Hệ thống trung tâm - nhà sách
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <h3 className="font-bold text-[18px]">HỖ TRỢ</h3>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chính sách đổi - trả - hoàn tiền
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chính sách bảo hành - bồi hoàn
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chính sách vận chuyển
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chính sách khách sỉ
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <h3 className="font-bold text-[18px]">
                                TÀI KHOẢN CỦA TÔI
                            </h3>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Đăng nhập/Tạo mới tài khoản
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Thay đổi địa chỉ khách hàng
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Chi tiết tài khoản
                                </Link>
                            </li>
                            <li className="my-1">
                                <Link
                                    href="#"
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Lịch sử
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="my-5">
                        <p className="font-bold text-[18px] text-center md:text-start">
                            LIÊN HỆ
                        </p>
                        <div className="flex flex-col md:flex-row justify-between">
                            <p className="flex gap-2 justify-center md:justify-normal my-2 md:my-0">
                                <MapPin />
                                Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần
                                Thơ
                            </p>
                            <p className="flex gap-2 justify-center md:justify-normal my-2 md:my-0">
                                <Mail />
                                cskh@exmaple.com
                            </p>
                            <p className="flex gap-2 justify-center md:justify-normal my-2 md:my-0">
                                <Phone />
                                0123456789
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="mapouter">
                            <div className="gmap_canvas flex justify-center md:justify-start w-full">
                                <iframe
                                    width="400"
                                    height="200"
                                    id="gmap_canvas"
                                    src="https://maps.google.com/maps?q=Can Tho University&output=embed"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
