// import { useOAuth } from '@clerk/clerk-expo';
// import { router } from 'expo-router';
// import { Alert, Image, Text, View } from 'react-native';

// import { Button } from '@/components/Button';
// import { icons } from '@/constants';
// import { googleOAuth } from '@/lib/auth';

// const OAuth = () => {
//     const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

//     const handleGoogleSignIn = async () => {
//         const result = await googleOAuth(startOAuthFlow);

//         if (result.code === 'session_exists') {
//             Alert.alert(
//                 'Success',
//                 'Session exists. Redirecting to home screen.',
//             );
//             router.replace('/(root)/(tabs)/home');
//         }

//         Alert.alert(result.success ? 'Success' : 'Error', result.message);
//     };

//     return (
//         <View>
//             <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
//                 <View className="flex-1 h-[1px] bg-general-100" />
//                 <Text className="text-lg">Or</Text>
//                 <View className="flex-1 h-[1px] bg-general-100" />
//             </View>

//             <Button
//                 label="Log In with Google"
//                 className="mt-5 w-full shadow-none"
//                 variant="ghost"
//                 onPress={handleGoogleSignIn}
//             >
//                 <Image
//                     source={icons.google}
//                     resizeMode="contain"
//                     className="w-5 h-5 mx-2"
//                 />
//             </Button>
//         </View>
//     );
// };

// export default OAuth;
