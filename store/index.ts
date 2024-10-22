import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    AuthStore,
    Delivery,
    DeliveryStore,
    DriverStore,
    IProduct,
    LocationStore,
    MarkerData,
    Notification,
    NotificationStore,
    ProductStore,
    UserStore,
} from '@/types/type';

export const useLocationStore = create<LocationStore>((set) => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLatitude: null,
    destinationLongitude: null,
    destinationAddress: null,
    setUserLocation: ({
        latitude,
        longitude,
        address,
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address,
        }));

        // if driver is selected and now new location is set, clear the selected driver
        const { selectedDriver, clearSelectedDriver } =
            useDriverStore.getState();
        if (selectedDriver) clearSelectedDriver();
    },

    setDestinationLocation: ({
        latitude,
        longitude,
        address,
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address,
        }));

        // if driver is selected and now new location is set, clear the selected driver
        const { selectedDriver, clearSelectedDriver } =
            useDriverStore.getState();
        if (selectedDriver) clearSelectedDriver();
    },
}));

export const useDriverStore = create<DriverStore>((set) => ({
    drivers: [] as MarkerData[],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) =>
        set(() => ({ selectedDriver: driverId })),
    setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
    clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));

export const useAuthStore = create<AuthStore>()(
    immer((set) => ({
        accessToken: '',
        setAccessToken: (accessToken: string) => {
            (async () => {
                const jsonValue = JSON.stringify(accessToken);
                await AsyncStorage.setItem('accessToken', jsonValue);
            })();
            set((state) => {
                state.accessToken = accessToken;
            });
        },
        setRefreshToken: (refreshToken: string) => {
            (async () => {
                const jsonValue = JSON.stringify(refreshToken);
                await AsyncStorage.setItem('refreshToken', jsonValue);
            })();
        },
        userLogout: () => {
            (async () => {
                await Promise.all([
                    AsyncStorage.removeItem('accessToken'),
                    AsyncStorage.removeItem('refreshToken'),
                ]);
            })();
            set((state) => {
                state.accessToken = '';
            });
        },
    })),
);

export const useUserStore = create<UserStore>()(
    immer((set) => ({
        profile: {
            email: '',
            avatar: '',
            name: '',
            phone: '',
            role: '',
        },
        address: {
            province: '',
            district: '',
            ward: '',
            address: '',
        },
        historySearch: [],
        localSearch: [],
        cart: [],
        checkout: [],
        paymentId: '',
        removeUserProfile: () => {
            (async () => {
                await Promise.all([
                    AsyncStorage.removeItem('profile'),
                    AsyncStorage.removeItem('cart'),
                ]);
            })();
            set(() => ({
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
            }));
        },
        setProfile: (profile) => {
            (async () => {
                const jsonValue = JSON.stringify(profile);
                await AsyncStorage.setItem('profile', jsonValue);
            })();
            set(() => ({
                profile,
            }));
        },
        setAddress: (address) => {
            (async () => {
                const jsonValue = JSON.stringify(address);
                await AsyncStorage.setItem('address', jsonValue);
            })();
            set(() => ({
                address,
            }));
        },
        updateAvatar: (avatar) =>
            set((state) => {
                state.profile.avatar = avatar;
            }),
        setHistorySearchItem: (item) =>
            set((state) => {
                state.historySearch.push(item);
            }),
        setHistorySearchList: (list) =>
            set((state) => {
                state.localSearch = [];
                state.historySearch = [...list];
            }),
        removeHistorySearch: (item) =>
            set((state) => {
                state.historySearch = state.historySearch.filter(
                    (searchItem) => searchItem.id !== item.id,
                );
            }),
        setLocalSearchItem: (item) =>
            set((state) => {
                state.localSearch.push(item);
            }),
        removeLocalSearch: (item) =>
            set((state) => {
                state.localSearch = state.localSearch.filter(
                    (searchItem) => searchItem.id !== item.id,
                );
            }),
        setCartProducts: (products) => {
            (async () => {
                const jsonValue = JSON.stringify(products);
                await AsyncStorage.setItem('cart', jsonValue);
            })();
            set((state) => {
                state.cart = products;
            });
        },
        removeCartItem: (productId) =>
            set((state) => {
                state.cart = state.cart.filter(
                    (cartItem) => cartItem.id !== productId,
                );
            }),
        setProductCheckout: (products) =>
            set((state) => {
                state.checkout = products;
            }),
        removeProductCheckout: () =>
            set((state) => {
                state.checkout = [];
            }),
        setPaymentId: (paymentId) =>
            set((state) => {
                state.paymentId = paymentId;
            }),
        removePaymentId: () =>
            set((state) => {
                state.paymentId = '';
            }),
    })),
);

export const useDeliveryStore = create<DeliveryStore>()(
    immer((set) => ({
        deliveryList: [],
        setDeliveryList: (list: Delivery[]) =>
            set(() => ({
                deliveryList: list,
            })),
    })),
);

export const useProductStore = create<ProductStore>()(
    immer((set) => ({
        productsSearch: [],
        setProductsSearch: (list: IProduct[]) =>
            set(() => ({
                productsSearch: list,
            })),
    })),
);

export const useNotificationStore = create<NotificationStore>()(
    immer((set) => ({
        notifications: [],
        setNotifications: (notifications: Notification[]) =>
            set(() => ({
                notifications,
            })),
        addNotification: (notification) =>
            set((state) => {
                const newList = state.notifications.reverse();
                newList.push(notification);
                state.notifications = newList.reverse();
            }),
    })),
);
