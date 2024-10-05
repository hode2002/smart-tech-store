import { StripeProvider } from '@stripe/stripe-react-native';
import { Image, Text, View } from 'react-native';
import Payment from '@/components/Payment';
import RideLayout from '@/components/RideLayout';
import { icons } from '@/constants';
// import { formatTime } from '@/lib/utils';
import { useDriverStore, useLocationStore } from '@/store';
import { useEffect, useState } from 'react';

interface IUser {
    fullName: string;
    emailAddresses: { emailAddress: string }[];
    amount: number;
    driverId: any;
    rideTime: any;
}
const Laptop = () => {
    // const { user } = useUser();
    const [user, setUser] = useState<IUser>({
        amount: 0,
        driverId: '12345',
        emailAddresses: [{ emailAddress: 'user@example.com' }],
        fullName: 'user@example.com',
        rideTime: '12345',
    });

    useEffect(() => {
        setUser({
            fullName: 'HVD',
            emailAddresses: [{ emailAddress: 'HVD@gmail.com' }],
            amount: 100,
            driverId: '123',
            rideTime: '123',
        });
    }, []);
    const { userAddress, destinationAddress } = useLocationStore();
    const { drivers, selectedDriver } = useDriverStore();

    const driverDetails = drivers?.filter(
        (driver) => +driver.id === selectedDriver,
    )[0];

    return (
        <View>
            <Text>Laptop page</Text>
        </View>
    );
};

export default Laptop;
