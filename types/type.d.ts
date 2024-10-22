import { TextInputProps, TouchableOpacityProps } from 'react-native';

declare interface IProduct {
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
    options: {
        name: string;
        values: string[];
    }[];
}

declare interface FetchAllBannersResponseType {
    statusCode: number;
    message: string;
    data: BannersResponseType[];
}

declare interface BannersResponseType {
    id: string;
    title: string;
    image: string;
    link: string;
    slug: string;
    status: 'show' | 'hide';
    type: 'big' | 'side' | 'slide';
    created_at: string;
    updated_at: string;
}

declare interface Driver {
    id: number;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
}

declare interface MarkerData {
    latitude: number;
    longitude: number;
    id: number;
    title: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
    price?: string;
}

declare interface MapProps {
    destinationLatitude?: number;
    destinationLongitude?: number;
    onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
    selectedDriver?: number | null;
    onMapReady?: () => void;
}

declare interface Ride {
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: number;
    fare_price: number;
    payment_status: string;
    driver_id: number;
    user_id: string;
    created_at: string;
    driver: {
        first_name: string;
        last_name: string;
        car_seats: number;
    };
}

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
    textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success';
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
        latitude,
        longitude,
        address,
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

declare interface PaymentProps {
    fullName: string;
    email: string;
    amount: string;
    driverId: number;
    rideTime: number;
}

declare interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
        latitude,
        longitude,
        address,
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    setDestinationLocation: ({
        latitude,
        longitude,
        address,
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface DriverStore {
    drivers: MarkerData[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: MarkerData[]) => void;
    clearSelectedDriver: () => void;
}

declare interface DriverCardProps {
    item: MarkerData;
    selected: number;
    setSelected: () => void;
}

declare interface AuthStore {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    userLogout: () => void;
}

declare interface HistorySearchItem {
    id: string;
    search_content: string;
}

declare interface UserProfile {
    email: string;
    name?: string | '';
    avatar: string;
    phone?: string | '';
    role?: string | '';
}

declare interface UserAddress {
    address?: string | null;
    province: string;
    district: string;
    ward: string;
}

declare interface ProductOption {
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
}

declare interface CartItem {
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
}

declare interface ProductCheckout {
    id: string;
    name: string;
    thumbnail: string;
    unitPrice: number;
    priceModifier: number;
    quantity: number;
    weight: number;
    discount: number;
}

declare interface UserStore {
    profile: UserProfile;
    address: UserAddress;
    historySearch: HistorySearchItem[];
    localSearch: HistorySearchItem[];
    cart: CartItem[];
    checkout: ProductCheckout[];
    paymentId: string;
    removeUserProfile: () => void;
    setProfile: (profile: UserProfile) => void;
    setAddress: (address: UserAddress) => void;
    updateAvatar: (avatar: string) => void;
    setHistorySearchItem: (item: HistorySearchItem) => void;
    setHistorySearchList: (list: HistorySearchItem[]) => void;
    removeHistorySearch: (item: HistorySearchItem) => void;
    setLocalSearchItem: (item: HistorySearchItem) => void;
    removeLocalSearch: (item: HistorySearchItem) => void;
    setCartProducts: (products: CartItem[] | []) => void;
    removeCartItem: (productId: string) => void;
    setProductCheckout: (products: ProductCheckout[] | []) => void;
    removeProductCheckout: () => void;
    setPaymentId: (paymentId: string) => void;
    removePaymentId: () => void;
}

declare interface ProvinceResponse {
    ProvinceID: number;
    ProvinceName: string;
}

declare interface DistrictResponse {
    DistrictID: number;
    DistrictName: string;
}

declare interface WardResponse {
    WardCode: number;
    WardName: string;
}

declare interface AddressOption {
    id: string;
    value: string;
    label: string;
}

declare interface CartTableColumn {
    id: string;
    product: {
        name: string;
        thumbnail: string;
    };
    unitPrice: number;
    quantity: number;
    total: number;
    selectedOption: ProductOption;
    otherOptions?: ProductOption[];
}

declare interface CheckoutTableColumn {
    id: string;
    product: {
        name: string;
        thumbnail: string;
    };
    unitPrice: number;
    quantity: number;
    total: number;
    discount: number;
    priceModifier: number;
}

declare interface Delivery {
    id: string;
    name: string;
    slug: string;
}

declare interface DeliveryStore {
    deliveryList: Delivery[];
    setDeliveryList: (list: Delivery[]) => void;
}

declare interface Notification {
    id: string;
    title: string;
    content: string;
    images: string;
    status: number;
    slug: string;
    link: string;
    type: 'ORDER' | 'COMMON' | 'VOUCHER' | 'COMMENT';
    created_at: Date;
    updated_at: Date;
}

export type CreateOrderType = {
    name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    hamlet?: string;
    note?: string;
    delivery_id: string;
    payment_method: string;
    order_details: {
        product_option_id: string;
        quantity: number;
    }[];
};

declare interface ProductStore {
    productsSearch: IProduct[];
    setProductsSearch: (products: IProduct[]) => void;
}

declare interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
}
