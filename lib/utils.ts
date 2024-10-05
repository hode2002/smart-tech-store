import {
    ProductFilterType,
    TechnicalSpecsItem,
} from '@/schemaValidations/product.schema';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

import { Ride } from '@/types/type';

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

const convertOptionName = (name: string) => {
    const data = {
        brands: 'b',
        operatingSystems: 'o',
        rams: 'ra',
        roms: 'ro',
        specialFeatures: 'co',
        charger: 'c',
        pin: 'p',
    };

    return data[name as keyof typeof data];
};

export const convertFilterOptionToQueryString = (filter: ProductFilterType) => {
    let querystring = '&';
    const keys = Object.keys(filter);

    keys.forEach((key: string) => {
        let values = filter[key as keyof typeof filter];
        const target = values[values.length - 1] ?? 'all';
        if (target !== 'all') {
            const keyName = convertOptionName(key);
            if (key !== 'prices') {
                querystring +=
                    (querystring.length === 1 ? '' : '&') +
                    keyName +
                    '=' +
                    values;
            } else {
                querystring += (querystring.length === 1 ? '' : '&') + values;
            }
            values = values.filter((value) => value !== 'all');
        } else {
            values = ['all'];
        }
    });

    return querystring;
};

const translation = [
    'screen',
    'screen_size',
    'os',
    'front_camera',
    'rear_camera',
    'chip',
    'ram',
    'rom',
    'sim',
    'battery',
    'weight',
    'connection',
];

export const translateSpecs = (
    specs: TechnicalSpecsItem[],
): TechnicalSpecsItem[] => {
    return Object.keys(specs)
        .map((_, index) => {
            return {
                name: translation[index],
                value: specs[index].value,
            };
        })
        .filter((item) => item != null);
};

export const arraySpecsToObject = (
    array: TechnicalSpecsItem[],
): {
    [key: string]: any;
} => {
    return array.reduce((result: any, specs) => {
        result[specs.name] = specs.value;
        return result;
    }, {} as TechnicalSpecsItem);
};

export const generateSlug = (text: string) => {
    return slugify(text, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true,
    });
};

export const obfuscateEmail = (email: string | undefined) => {
    if (!email) return;
    const [localPart, domain] = email.split('@');
    const domainName = domain.split('.')[0];
    const obfuscatedLocalPart = `${localPart[0]}***`;
    return `${obfuscatedLocalPart}@${domainName}.com`;
};

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export const sortRides = (rides: Ride[]): Ride[] => {
    const result = rides.sort((a, b) => {
        const dateA = new Date(`${a.created_at}T${a.ride_time}`);
        const dateB = new Date(`${b.created_at}T${b.ride_time}`);
        return dateB.getTime() - dateA.getTime();
    });

    return result.reverse();
};

export function formatTime(minutes: number): string {
    const formattedMinutes = +minutes?.toFixed(0) || 0;

    if (formattedMinutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(formattedMinutes / 60);
        const remainingMinutes = formattedMinutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day < 10 ? '0' + day : day} ${month} ${year}`;
}
