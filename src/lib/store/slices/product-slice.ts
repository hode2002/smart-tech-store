import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ProductType = {
    id: string;
    name: string;
    price: number;
    promotions: string[];
    warranties: string[];
    label: string;
    created_at?: string;
    descriptions: {
        id: string;
        content: string;
    }[];
    brand: {
        id: string;
        name: string;
        logo_url: string;
        slug: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    product_options: {
        id: string;
        sku: string;
        thumbnail: string;
        price_modifier: number;
        stock: number;
        discount: number;
        is_sale: boolean;
        slug: string;
        label_image: string;
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string;
        }[];
        technical_specs: {
            name: string;
            value: string;
        }[];
        reviews: {
            id: string;
            user: {
                id: string;
                email: string;
                name: string;
                avatar: string;
            };
            star: number;
            comment: string;
            children: {
                user: {
                    id: string;
                    email: string;
                    name: string;
                    avatar: string;
                };
                comment: string;
                created_at: string;
            }[];
            created_at: string;
            _count: {
                children: number;
            };
        }[];
        options: {
            name: string;
            value: string;
            adjust_price: number;
        }[];
        rating: {
            total_reviews: number;
            details: number[];
            overall: number;
        };
    }[];
};

export interface IProductState {
    products: ProductType[];
    productSale: ProductType[];
    productCategory: ProductType[];
    productBrand: ProductType[];
}

const initialState: IProductState = {
    products: [],
    productSale: [],
    productCategory: [],
    productBrand: [],
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProductList: (state, action: PayloadAction<ProductType[]>) => {
            state.products = action.payload;
        },
        setProductSale: (state, action: PayloadAction<ProductType[]>) => {
            state.productSale = action.payload;
        },
        setProductCategory: (state, action: PayloadAction<ProductType[]>) => {
            state.productCategory = action.payload;
        },
        setProductBrand: (state, action: PayloadAction<ProductType[]>) => {
            state.productBrand = action.payload;
        },
    },
});

export const {
    setProductList,
    setProductSale,
    setProductCategory,
    setProductBrand,
} = productSlice.actions;
export const productReducer = productSlice.reducer;
