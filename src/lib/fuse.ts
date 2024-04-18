import { ProductType } from '@/lib/store/slices';
import Fuse from 'fuse.js';

const fuseOptions = {
    keys: ['name'],
    useExtendedSearch: true,
    ignoreLocation: true,
    threshold: 0.3,
    fieldNormWeight: 2,
};

export const createFuseInstance = (
    list: ProductType[],
    keys: string[] = ['name'],
) => {
    return new Fuse(list, { ...fuseOptions, keys });
};
