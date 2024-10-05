import { Stack } from 'expo-router';

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                animation: 'ios',
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    headerShown: true,
                    headerTitle: 'Đăng nhập',
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    headerShown: true,
                    headerTitle: 'Đăng ký',
                }}
            />
            <Stack.Screen
                name="forgot-password"
                options={{
                    headerShown: true,
                    headerTitle: 'Quên mật khẩu',
                }}
            />
        </Stack>
    );
};

export default Layout;
