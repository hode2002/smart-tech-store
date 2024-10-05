import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// import { useTheme } from 'nativewind';

const ModeToggle = () => {
    // const { setTheme, theme } = useTheme();

    return (
        <View className="flex-row items-center justify-end p-4">
            <TouchableOpacity
                // onPress={() => {
                //     const newTheme = theme === 'light' ? 'dark' : 'light';
                //     setTheme(newTheme);
                // }}
                className="flex-row items-center border border-gray-300 rounded-md p-2"
            >
                <Text className="text-lg">
                    theme === 'light' {/* {theme === 'light' ? '🌙' : '☀️'} */}
                </Text>
                <Text className="ml-2">
                    theme === 'dark'{' '}
                    {/* {theme === 'light' ? 'Dark Mode' : 'Light Mode'} */}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ModeToggle;
