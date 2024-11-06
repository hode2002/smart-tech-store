import moment from 'moment';
import { Image, Text, View } from 'react-native';
import { NotificationType } from '@/lib/apiRequest/notification';
import { icons } from '@/constants';
import HTMLView from 'react-native-htmlview';

const NotificationItem = ({
    notification,
}: {
    notification: NotificationType;
}) => {
    const iconByNotificationType = () => {
        switch (notification.type) {
            case 'ORDER':
                return icons.shoppingBag;
            case 'COMMENT':
                return icons.messageCircle;
            case 'COMMON':
                return icons.info;
            case 'VOUCHER':
                return icons.ticketCheck;
        }
    };

    return (
        <View
            className={`${
                notification.status === 0 ? 'bg-accent' : ''
            } border border-gray-200 my-2 p-4 leading-none`}
        >
            <View className="flex-row gap-4 items-start capitalize">
                <View>
                    <Image
                        source={iconByNotificationType()}
                        className="w-10 h-10"
                        resizeMode="contain"
                    />
                </View>
                <View className="w-[80%]">
                    <Text className="font-bold text-md leading-none">
                        {notification.title}
                    </Text>
                    <HTMLView value={notification.content} />
                    <Text className="text-sm leading-none my-2">
                        {moment(notification.created_at).format('DD-MM-YYYY')}
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {JSON.parse(notification?.images).map(
                            (image: string, index: number) => (
                                <Image
                                    key={index}
                                    source={{ uri: image }}
                                    alt={notification.title}
                                    width={50}
                                    height={50}
                                />
                            ),
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default NotificationItem;
