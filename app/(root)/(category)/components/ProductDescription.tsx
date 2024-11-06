import { Button } from '@/components/Button';
import { ProductDescriptionType } from '@/schemaValidations/product.schema';
import React, { useState } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import HTMLView, { HTMLViewNode } from 'react-native-htmlview';
import { LinearGradient } from 'expo-linear-gradient';

const ProductDescription = ({
    descriptions,
}: {
    descriptions: ProductDescriptionType[];
}) => {
    const [isShowMore, setIsShowMore] = useState<boolean>(false);

    const renderNode = (node: HTMLViewNode) => {
        if (node.name === 'img') {
            const img = node.attribs;

            return (
                <Image
                    key={img.src}
                    source={{ uri: img.src }}
                    style={{
                        width: Dimensions.get('window').width,
                        height: 200,
                    }}
                    resizeMode={'contain'}
                />
            );
        }
    };

    return (
        <View className="mt-8 w-full flex-col items-center relative">
            <Text className="self-start text-[20px] font-JakartaBold">
                Thông tin sản phẩm
            </Text>
            <View
                className={`py-4 min-h-[400px] ${isShowMore ? 'animate-fade-down' : 'max-h-[50vh] overflow-hidden'}`}
            >
                <HTMLView
                    value={descriptions[0].content.replace(/\r?\n|\r/g, '')}
                    renderNode={renderNode}
                    addLineBreaks={true}
                />
            </View>
            {!isShowMore && (
                <View className="bottom-4 h-32 left-0 absolute w-full">
                    <LinearGradient
                        colors={[
                            'rgba(255, 255, 255, 0)',
                            'rgba(255, 255, 255, 0.625)',
                            'rgba(255, 255, 255, 1)',
                        ]}
                        style={{ flex: 1 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    />
                </View>
            )}
            <Button
                label={isShowMore ? 'Thu gọn' : 'Xem thêm'}
                className="w-max mt-4 z-30"
                onPress={() => setIsShowMore(!isShowMore)}
            />
        </View>
    );
};

export default ProductDescription;
