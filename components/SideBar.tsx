import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
// import { useAppSelector } from '@/lib/store';
import { useNavigation } from '@react-navigation/native';
import { icons } from '@/constants';
import ModeToggle from '@/components/ModeToggle';
// import { Menu } from 'lucide-react';
// import { ModeToggle } from '@/components/mode-toggle';

type Props = {
    handleLogout: () => Promise<void>;
};

export default function SideBar(props: Props) {
    const { handleLogout } = props;
    // const profile = useAppSelector((state) => state.user.profile);
    const profile = {
        email: null,
        role: 'USER',
    };
    const navigation = useNavigation();

    // const isActive = (path: string) =>
    //     navigation.canGoBack() &&
    //     navigation.getState().routes.some((route) => route.name === path);

    const isActive = (path: string) => {};

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
            <TouchableOpacity
                // onPress={() => navigation.toggleDrawer()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <Image source={icons.menu} />
            </TouchableOpacity>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <TouchableOpacity
                // onPress={() => navigation.navigate('Home')}
                >
                    <Image
                        source={{ uri: '/images/site-logo.png' }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                </TouchableOpacity>
                <ModeToggle />
            </View>

            <View
                style={{
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 8,
                }}
            >
                {profile?.email ? (
                    <View>
                        <TouchableOpacity
                            // onPress={() => navigation.navigate('UserProfile')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Image
                                source={{
                                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQNvWDvQb_rCtRL-p_w329CtzHmfzfWP0FIw&s',
                                    // profile.avatar
                                }}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                }}
                            />
                            <Text style={{ marginLeft: 8 }}>
                                {profile.email}
                            </Text>
                        </TouchableOpacity>
                        {profile?.role === 'ADMIN' && (
                            <TouchableOpacity
                                // onPress={() =>
                                //     navigation.navigate('AdminDashboard')
                                // }
                                style={{ marginBottom: 8 }}
                            >
                                <Text
                                // style={{
                                //     fontWeight: isActive('AdminDashboard')
                                //         ? 'bold'
                                //         : 'normal',
                                // }}
                                >
                                    Admin Dashboard
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            // onPress={() => navigation.navigate('UserProfile')}
                            style={{ marginBottom: 8 }}
                        >
                            <Text
                            // style={{
                            //     fontWeight: isActive('UserProfile')
                            //         ? 'bold'
                            //         : 'normal',
                            // }}
                            >
                                Thông tin tài khoản
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={() => navigation.navigate('UserPurchases')}
                            style={{ marginBottom: 8 }}
                        >
                            <Text
                            // style={{
                            //     fontWeight: isActive('UserPurchases')
                            //         ? 'bold'
                            //         : 'normal',
                            // }}
                            >
                                Đơn mua
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        // onPress={handleLogout}
                        >
                            <Text style={{ color: 'red' }}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity
                            // onPress={() => navigation.navigate('Register')}
                            style={{ marginBottom: 8 }}
                        >
                            <Text>Đăng ký</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        // onPress={() => navigation.navigate('Login')}
                        >
                            <Text>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
