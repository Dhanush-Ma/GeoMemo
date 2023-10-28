import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import FontText from '../../../Components/FontText';
import EntypeIcon from 'react-native-vector-icons/Entypo';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TroubleShoot = ({navigation}) => {
  const androidLocationInstructions = [
    "Go to your device's settings.",
    "Navigate to 'Apps' or 'Application Manager.' ",
    'Find and select our app from the list.',
    "Tap on 'Permissions' and ensure that 'Location' is set to 'Allow all the time.'",
  ];

  return (
    <>
      <StatusBar backgroundColor={'#8766eb'} />
      <View
        style={{marginTop: StatusBar.currentHeight}}
        className="bg-accentColor2 px-3 py-4 flex flex-row justify-center items-center relative">
        <Pressable
          className="absolute top- left-5 "
          onPress={() => navigation.goBack()}>
          <EntypeIcon name="chevron-left" size={30} />
        </Pressable>

        <FontText className="text-2xl text-center ">Troubleshooting</FontText>
      </View>
      <ScrollView className="flex-1 bg-primaryColor px-6 pb-96 pt-5">
        <FontText weight={'Medium'} className="text-justify text-base">
          {'\t\t\t\t'}This app is designed to provide you with a seamless
          experience for location-based messaging. However, like any app, you
          may encounter issues from time to time. To help you resolve these
          issues, please follow these{' '}
          <FontText weight={'Bold'} className="text-accentColor2">
            troubleshooting steps:
          </FontText>
        </FontText>
        <View className="mt-6 mb-10">
          <View className="mb-5">
            <FontText
              weight={'Bold'}
              className="text-[22px] text-accentColor2 mb-2">
              1. Ensure Location Permissions:
            </FontText>
            <View className="ml-5">
              <FontText weight={'Medium'} className="text-justify text-base">
                Make sure that your device has granted location permission to
                the app. Without this permission, the app won't be able to
                access your location. Here's how to check and grant location
                permission:{'\n'}
              </FontText>
              <View>
                <FontText weight={'Bold'} className="text-accentColor2 text-xl">
                  For Android:
                </FontText>
                {androidLocationInstructions.map((item, idx) => (
                  <View key={idx} className="flex flex-row items-start mb-2 space-x-1">
                    <FontText weight={'Medium'} className="text-base">
                      📍
                    </FontText>
                    <FontText weight={'Medium'} className="text-base">
                      {item}
                    </FontText>
                  </View>
                ))}
              </View>
              <View className="h-64 w-full border-2 border-accentColor2 bg-secondaryColor rounded-xl my-5">
                <Image
                  className="w-full h-full"
                  resizeMode="contain"
                  source={require('../../../Assets/troubleshoot_location_permission.jpg')}
                />
              </View>
            </View>
          </View>
          <View className="mb-5">
            <FontText
              weight={'Bold'}
              className="text-[22px] text-accentColor2 mb-2">
              2. Confirm Background Location Access:
            </FontText>
            <View className="ml-5">
              <FontText className="text-justify text-base">
                To ensure that the app works seamlessly, it's important to
                confirm that background location access is enabled. Some
                features of the app rely on continuous location monitoring. You
                can confirm this by checking for a notification badge on the
                screen. Here's how to do it: Look for a notification badge or
                icon on the app's screen. This badge indicates that the app is
                actively monitoring your location in the background.
              </FontText>
              <View className="h-24 w-full border-2 border-accentColor2 bg-secondaryColor rounded-xl my-5 overflow-hidden">
                <Image
                  className="w-full h-full"
                  resizeMode="contain"
                  source={require('../../../Assets/troubleshoot_notification_1.jpg')}
                />
              </View>
              <View className="h-24 w-full border-2 border-accentColor2 bg-secondaryColor rounded-xl mb-5 overflow-hidden">
                <Image
                  className="w-full h-full"
                  resizeMode="contain"
                  source={require('../../../Assets/troubleshoot_notification_2.jpg')}
                />
              </View>
            </View>
          </View>
          <View>
            <FontText
              weight={'Bold'}
              className="text-[22px] text-accentColor2 mb-2">
              3. Reporting an Issue:
            </FontText>
            <View className="ml-5">
              <FontText className="text-justify text-base">
                If you have followed the above steps and still experiencing
                issues with the app, please provide us with a detailed
                explanation of the problem. The more information you can
                provide, the better we can assist you. Be sure to include: A
                description of the issue you're facing. Any error messages, if
                applicable. The steps you took leading up to the issue. Your
                device model and operating system version. You can reach out to
                our support team.
              </FontText>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Report');
              }}>
              <Pressable className="bg-accentColor2 py-3 flex justify-center items-center rounded-md mt-5">
                <FontText className="text-xl" weight={'Bold'}>
                  Report Issue
                </FontText>
              </Pressable>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default TroubleShoot;
