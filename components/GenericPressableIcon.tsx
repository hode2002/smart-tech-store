/* A  standard pressable icon that can be used frequently*/

import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GenericPressableIcon(props: any) {
    const {
        onPress,
        imagePath,
        iconWidth = 30,
        iconHeight = 30,
        tintColor = null,
        style = {},
        hitSlop = { top: 0, bottom: 0, left: 0, right: 0 },
    } = props;

    return (
        <TouchableOpacity
            style={[
                styles.logoMainContainer,
                { width: iconWidth, height: iconHeight },
                style,
            ]}
            onPress={onPress}
            hitSlop={hitSlop}
        >
            <Image
                source={imagePath}
                style={styles.logoStyle}
                tintColor={tintColor}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    logoMainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    logoStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
