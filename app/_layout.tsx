import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import '@/assets/styles/global.css';
import { NativeBaseProvider } from 'native-base';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        'Jakarta-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
        'Jakarta-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'Jakarta-ExtraLight': require('../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
        'Jakarta-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
        'Jakarta-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
        Jakarta: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
        'Jakarta-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <NativeBaseProvider>
            <MenuProvider>
                <Stack
                    screenOptions={{
                        animation: 'ios',
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="(root)"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="(auth)"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </MenuProvider>
            <Toast visibilityTime={2000} />
        </NativeBaseProvider>
    );
}
