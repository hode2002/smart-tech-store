import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const timeConvert = (num: number) => {
    const hours =
        Math.floor(num / 60) <= 9
            ? '0' + Math.floor(num / 60)
            : Math.floor(num / 60);
    const minutes = num % 60 <= 9 ? '0' + (num % 60) : num % 60;

    return hours + ':' + minutes;
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

export const randomElement = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
