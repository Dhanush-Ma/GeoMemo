import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  useWindowDimensions,
  Image,
} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontText from '../../../Components/FontText';
import getFormattedTime from '../../../Utils/getFormattedTime';
import {useUserContext} from '../../../Contexts/UserContext';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypeIcon from 'react-native-vector-icons/Entypo';
import signout from '../../../Utils/signout';
import {useAuthContext} from '../../../Contexts/AuthContext';
import {launchImageLibrary} from 'react-native-image-picker';
import ShowProfileImage from '../../../Components/User/ShowProfileImage';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';

const Profile = ({navigation}) => {
  const {user, currentAlert, auth, uploadPhotoModal} = useUserContext();
  const {setAuth} = useAuthContext();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const {username, phoneNumber, email, account_created} = user;
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();

  const handleSignOut = async () => {
    ReactNativeForegroundService.remove_all_tasks();
    ReactNativeForegroundService.stop();
    await AsyncStorage.removeItem('CURRENT_ALERT');
    await signout(setAuth);
  };

  const handleImageChoose = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 5000,
      maxWidth: 5000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        uploadPhotoModal.handleUploadPhotoModal(
          uploadPhotoModal.uploadPhotoModalRef,
          'open',
          imageUri,
        );
      }
    });
  };

  useEffect(() => {
    if (confirmLogout) setConfirmLogout(false);
  }, [isFocused]);

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <StatusBar backgroundColor="#8766eb" />
        <View
          style={{
            alignSelf: 'center',
            width: width,
            overflow: 'hidden',
            height: width / 1.5,
          }}
          className="bg-primaryColor">
          <View
            style={{
              borderRadius: width,
              width: width * 2,
              height: width * 2,
              marginLeft: -(width / 2),
              position: 'absolute',
              bottom: 0,
              overflow: 'hidden',
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,
              paddingBottom: 15,
              elevation: 5,
            }}
            className="bg-accentColor2 flex-1 justify-end items-center">
            {user?.profileImage ? (
              <Pressable
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 3.35,
                  elevation: 23,
                }}
                onPress={handleImageChoose}
                className="w-40 h-40 rounded-full border- border-white mb-2 flex justify-center items-center overflow-hidden bg-accentColor2">
                <FastImage
                  style={{width: '100%', height: '100%'}}
                  source={{uri: user.profileImage}}
                  resizeMode="cover"
                  priority={FastImage.priority.normal}
                />
              </Pressable>
            ) : (
              <Pressable
               
                onPress={handleImageChoose}
                className="w-40 h-40 rounded-full border-2 border-white mb-2 flex justify-center items-center ">
                <Image
                  style={{width: '60%', height: '60%'}}
                  source={require('../../../Assets/user_placeholder.png')}
                />
                <View className="absolute bottom-0 right-0">
                  <MaterialCommunityIcons
                    name="camera-marker"
                    size={30}
                    color="#000"
                  />
                </View>
              </Pressable>
            )}
            <FontText weight={'Medium'} className="text-2xl">
              {username}
            </FontText>
          </View>
        </View>
        <View className="bg-primaryColor flex-1 px-6 py-10 space-y-6">
          <View
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,

              elevation: 2,
            }}
            className="bg-secondaryColor1 rounded-md px-3 py-4 border-2 border-accentColor2">
            <FontText>Email</FontText>
            <FontText weight={'Medium'} className="text-xl">
              {email}
            </FontText>
          </View>
          <View
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,

              elevation: 2,
            }}
            className="bg-secondaryColor1 rounded-md px-3 py-4 border-2 border-accentColor2">
            <FontText>Phone Number</FontText>
            <FontText weight={'Medium'} className="text-xl">
              {phoneNumber}
            </FontText>
          </View>
          <View
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,

              elevation: 2,
            }}
            className="bg-secondaryColor1 rounded-md px-3 py-4 border-2 border-accentColor2">
            <FontText>Message Radius</FontText>
            <FontText weight={'Medium'} className="text-2xl">
              {'300m'}
            </FontText>
          </View>
          <View
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,
              elevation: 2,
            }}
            className="bg-secondaryColor1 rounded-md px-3 py-4 border-2 border-accentColor2">
            <FontText>Date Joined</FontText>
            <FontText weight={'Medium'} className="text-xl">
              {getFormattedTime(1695788291855)}
            </FontText>
          </View>
          <View
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,

              elevation: 2,
            }}
            className="bg-secondaryColor1 rounded-md px-3 py-4 border-2 border-accentColor2 ">
            <FontText className="text-xl">Send Messages on Whatsapp</FontText>
            <View className="mt-2 flex flex-row space-x-4 -ml-0.3">
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 12.35,

                  elevation: 18,
                }}
                className="bg-accentColor2 text-[#d8b4fe] text-xs font-medium px-2.5 py-1.5 rounded-md  h-13 items-center flex flex-row">
                <FontText>Coming Soon</FontText>
              </View>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 12.35,

                  elevation: 18,
                }}
                className="bg-accentColor2 text-[#d8b4fe] text-xs font-medium px-2.5 py-1.5 rounded-md  flex flex-row space-x-4 items-center">
                <FontText>Premium</FontText>
                <Image
                  className="w-6 h-6"
                  source={require('../../../Assets/premium.png')}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('TroubleShoot')}
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,
              elevation: 2,
            }}
            className=" rounded-md px-3 py-4 border-2 border-accentColor2 bg-accentColor2 flex flex-row  justify-between items-center">
            <View className="flex flex-row space-x-4 items-center">
              <MaterialIcons name="troubleshoot" size={25} />
              <FontText className="text-xl">Troubleshooting</FontText>
            </View>
            <EntypeIcon name="chevron-right" size={25} />
          </Pressable>
          <Pressable
            onPress={() => setConfirmLogout(true)}
            style={{
              shadowColor: '#fff',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,
              elevation: 2,
            }}
            className=" rounded-md px-3 py-4 border-2 border-accentColor2 bg-accentColor2 flex flex-row  justify-between items-center">
            <View className="flex flex-row space-x-4 items-center">
              <MaterialIcons name="logout" size={25} />
              <FontText className="text-xl">Logout</FontText>
            </View>
            <EntypeIcon name="chevron-right" size={25} />
          </Pressable>
        </View>
      </ScrollView>

      {confirmLogout && (
        <Pressable
          className="bg-black/80 absolute w-screen h-screen flex justify-center items-center"
          onPress={() => setConfirmLogout(false)}>
          <Pressable
            onPress={() => {}}
            className="bg-accentColor2  w-[80%] h-[30%] z-10 rounded-md flex justify-center items-center px-3">
            <FontText weight={'Medium'} className="text-center text-xl">
              Are you sure? If you have scheduled any messages it will be lost.
            </FontText>
            <View className="flex-row justify-around  w-full mt-8">
              <Pressable onPress={() => setConfirmLogout(false)}>
                <FontText
                  weight={'Medium'}
                  className="text-center py-3 bg-white text-primaryColor px-6 rounded-md text-lg">
                  Cancel
                </FontText>
              </Pressable>
              <Pressable
                onPress={handleSignOut}
                onPress={() => setConfirmLogout(true)}>
                <FontText
                  weight={'Medium'}
                  className="text-center py-3 bg-primaryColor px-6 rounded-md text-lg">
                  Logout
                </FontText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}
    </>
  );
};

export default Profile;
