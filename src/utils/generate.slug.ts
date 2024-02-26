import slugify from 'slugify';

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
