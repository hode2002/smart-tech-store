import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type UserProfile = {
    email: string;
    name?: string | '';
    avatar: string;
    phone?: string | '';
};

export type UserAddress = {
    address?: string | null;
    province: string;
    district: string;
    ward: string;
};

export type HistorySearchItem = { id: string; search_content: string };

export type ProductOption = {
    id: string;
    product_images: {
        id: string;
        image_url: string;
        image_alt_text: string;
    }[];
    price_modifier: number;
    label_image: string;
    is_sale: boolean;
    discount: number;
    options: {
        name: string;
        value: string;
        adjust_price: number;
    }[];
    slug: string;
    sku: string;
    stock: number;
    thumbnail: string;
    weight: number;
};

export type CartItem = {
    id: string;
    name: string;
    price: number;
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
    warranties: string[];
    selected_option: ProductOption;
    other_product_options: ProductOption[];
    quantity: number;
};

export type ProductCheckout = {
    id: string;
    name: string;
    thumbnail: string;
    unitPrice: number;
    quantity: number;
    total: number;
    weight: number;
};

export interface IUserState {
    profile: UserProfile;
    address: UserAddress;
    historySearch: Array<HistorySearchItem>;
    localSearch: Array<HistorySearchItem>;
    cart: CartItem[];
    checkout: ProductCheckout[];
    paymentId: string;
}

const initialState: IUserState = {
    profile: {
        email: '',
        avatar: '',
    },
    address: {
        province: '',
        district: '',
        ward: '',
    },
    historySearch: [],
    localSearch: [],
    cart: [],
    checkout: [],
    paymentId: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeUserProfile: (state) => {
            state.profile = {
                email: '',
                avatar: '',
            };
            state.address = {
                province: '',
                district: '',
                ward: '',
            };
            state.historySearch = [];
            state.localSearch = [];
            state.cart = [];
            state.checkout = [];
        },
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
        setAddress: (state, action: PayloadAction<UserAddress>) => {
            state.address = action.payload;
        },
        updateAvatar: (state, action: PayloadAction<string>) => {
            state.profile.avatar = action.payload;
        },
        setHistorySearchItem: (
            state,
            action: PayloadAction<HistorySearchItem>,
        ) => {
            state.historySearch.push(action.payload);
        },
        setHistorySearchList: (
            state,
            action: PayloadAction<HistorySearchItem[]>,
        ) => {
            state.localSearch = [];
            state.historySearch = action.payload;
        },
        removeHistorySearch: (
            state,
            action: PayloadAction<HistorySearchItem>,
        ) => {
            state.historySearch = state.historySearch.filter(
                (searchItem) => searchItem.id !== action.payload.id,
            );
        },
        setLocalSearchItem: (
            state,
            action: PayloadAction<HistorySearchItem>,
        ) => {
            state.localSearch.push(action.payload);
        },
        removeLocalSearch: (
            state,
            action: PayloadAction<HistorySearchItem>,
        ) => {
            state.localSearch = state.localSearch.filter(
                (searchItem) => searchItem.id !== action.payload.id,
            );
        },
        setCartProducts: (state, action: PayloadAction<CartItem[] | []>) => {
            state.cart = action.payload;
        },
        removeCartItem: (
            state,
            action: PayloadAction<{ productId: string }>,
        ) => {
            state.cart = state.cart.filter(
                (cartItem) => cartItem.id !== action.payload.productId,
            );
        },
        setProductCheckout: (
            state,
            action: PayloadAction<ProductCheckout[] | []>,
        ) => {
            state.checkout = action.payload;
        },
        removeProductCheckout: (state) => {
            state.checkout = [];
        },
        setPaymentId: (state, action: PayloadAction<string>) => {
            state.paymentId = action.payload;
        },
        removePaymentId: (state) => {
            state.paymentId = '';
        },
    },
});

export const {
    removeUserProfile,
    setProfile,
    setAddress,
    setHistorySearchItem,
    setHistorySearchList,
    removeHistorySearch,
    setLocalSearchItem,
    removeLocalSearch,
    setCartProducts,
    removeCartItem,
    setProductCheckout,
    removeProductCheckout,
    setPaymentId,
    removePaymentId,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
