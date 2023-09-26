import {
  View,
  PermissionsAndroid,
  StatusBar,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import {
  checkMultiple,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import {useEffect, useCallback, useRef, useMemo, useState} from 'react';
import {useUserContext} from '../Contexts/UserContext';
import {useAuthContext} from '../Contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import BottomTab from '../Components/BottomNavbar/BottomTab';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import MessageInfoBottomModal from '../Components/Modals/MessageInfoBottomModal';
import AddToFavBottomModal from '../Components/Modals/AddToFavBottomModal';
import ViewFavorites from '../Components/Modals/ViewFavoritesModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from 'react-native-push-notification';
import checkUserReachedMessageLocation from '../Utils/checkUserReachedMessageLocation';
import snedMessageToUser from '../Utils/sendMessageToUser';
import FontText from '../Components/FontText';
import getFormattedDate from '../Utils/getFormattedDate';
import BackgroundLocation

const UserStack = () => {
  const {
    user,
    setUser,
    alertMessageModal,
    currentAlert,
    setUserLocation,
    addToFavModal,
    viewFavModal,
    setCurrentAlert,
  } = useUserContext();
  const {auth, setAuth} = useAuthContext();
  const [permissions, setPermissions] = useState(true);

  const {alertMessageModalRef, alertMessageModalSnapPoints} = alertMessageModal;
  const {addToFavModalRef, addToFavModalSnapPoints} = addToFavModal;
  const {viewFavModalRef, viewFavModalSnapPoints} = viewFavModal;

  useEffect(() => {
    const permissionsToRequest = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
    ];

    const requestPermissions = async () => {
      const status = await checkMultiple(permissionsToRequest);

      const deniedPermissions = Object.entries(status).filter(
        ([_, permissionStatus]) => permissionStatus === 'denied',
      );

      deniedPermissions.forEach(async ([permission]) => {
        const permissionStatus = await requestMultiple([permission]);
        console.log(permissionStatus);
      });
      if (deniedPermissions.length !== 0) {
        setPermissions(false);
      }

      console.log(status);
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    try {
      ReactNativeForegroundService.add_task(
        () => {
          //console.log('Foreground Service ');
          Geolocation.getCurrentPosition(
            async position => {
              //console.log('Process....');
              //console.log(new Date().toLocaleTimeString());
              // console.log(position.coords)
              const {latitude, longitude} = position.coords;
              //setUserLocation({lat: latitude, lng: longitude});
              let messageInfo = await AsyncStorage.getItem('CURRENT_ALERT');
              messageInfo =
                messageInfo !== null ? JSON.parse(messageInfo) : null;

              // check user reached the location
              if (
                messageInfo &&
                checkUserReachedMessageLocation(
                  latitude,
                  longitude,
                  messageInfo.lat,
                  messageInfo.lng,
                )
              ) {
                try {
                  console.log('Process Mesg to user started');
                  await snedMessageToUser(
                    messageInfo.contact,
                    messageInfo.message,
                  );
                  const removedMessage = {
                    ...messageInfo,
                    status: 'Success',
                    timeStamp: Date.now(),
                  };
                  await firestore()
                    .collection('Users')
                    .doc(auth)
                    .update({
                      previous_messages:
                        firestore.FieldValue.arrayUnion(removedMessage),
                    });
                  console.log('Process Msg send to DB');

                  AsyncStorage.removeItem('CURRENT_ALERT');
                  setCurrentAlert(null);
                  console.log('Process Msg removed from current alert.');

                  // Send PUSH notification to user
                  PushNotification.localNotification({
                    channelId: 'GeoMemo',
                    title: 'Message sent',
                    message: `Your schedule message to ${messageInfo.contact.displayName} is sent successfully`,
                    playSound: true,
                  });
                  console.log('Process Msg: Notification finished');

                  console.log('Process Msg to user completed');
                } catch (error) {
                  await AsyncStorage.mergeItem('ERROR', JSON.stringify(error));
                }
              }

              // update every location to AsyncStorage
              let locationInfo = await AsyncStorage.getItem('LOCATION_INFO');
              locationInfo =
                locationInfo !== null ? JSON.parse(locationInfo) : null;
              if (locationInfo !== null) {
                //console.log(locationInfo);
                const lastLocation = locationInfo[locationInfo.length - 1];
                if (
                  lastLocation.latitude !== latitude &&
                  lastLocation.longitude !== longitude
                ) {
                  // update new location
                  locationInfo.push({
                    latitude,
                    longitude,
                    timeStamp: new Date(),
                  });
                  await AsyncStorage.setItem(
                    'LOCATION_INFO',
                    JSON.stringify(locationInfo),
                  );
                }
                //console.log(locationInfo.length);
              } else {
                const value = JSON.stringify([
                  {
                    latitude,
                    longitude,
                    timeStamp: new Date(),
                  },
                ]);
                await AsyncStorage.setItem('LOCATION_INFO', value);
              }

              // check if today date is over
              const storedDate = await AsyncStorage.getItem('TODAY_DATE');
              const todayDate = new Date().getDate();
              if (storedDate != todayDate) {
                console.log('here');
                const currentDate = new Date();
                const yesterdayDate = new Date(currentDate);
                yesterdayDate.setDate(currentDate.getDate() - 1);
                const formattedDate = getFormattedDate(yesterdayDate);

                await AsyncStorage.setItem(
                  'TODAY_DATE',
                  JSON.stringify(todayDate),
                );

                let locationInfo = await AsyncStorage.getItem('LOCATION_INFO');
                locationInfo = JSON.parse(locationInfo);
                await firestore()
                  .collection('Users')
                  .doc(auth)
                  .update({
                    timeline: firestore.FieldValue.arrayUnion({
                      date: formattedDate,
                      locationInfo: locationInfo,
                    }),
                  });
                await AsyncStorage.removeItem('LOCATION_INFO');
              }
              // console.log('Process End....');
            },
            error => {
              console.warn(error);
            },
            {
              accuracy: {
                android: 'high',
                ios: 'best',
              },
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              distanceFilter: 100,
            },
          );
        },
        {
          delay: 10000,
          onLoop: true,
          taskId: 'com.supersami.geoMemo',
          onError: e => console.log('Error logging:', e),
        },
      );
    } catch (error) {
      AsyncStorage.mergeItem('ERROR', JSON.stringify(error));

      console.log('error: ', error);
    }
  }, []);

  useEffect(() => {
    const database_subscriber = firestore()
      .collection('Users')
      .doc(auth)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data());
        console.log('user data');
        setUser(documentSnapshot.data());
      });

    return () => database_subscriber();
  }, [auth]);

  if (!permissions) {
    return (
      <View className="flex-1 bg-primaryColor justify-center items-center">
        <StatusBar backgroundColor="#131417" />
        <View className="w-[90%] h-[200px] bg-accentColor2 rounded-lg flex justify-center items-center px-2">
          <FontText weight={'Medium'} className="text-xl text-center ">
            To provide you with the best app experience, we require your
            permission to access.
          </FontText>
          <Pressable
            onPress={() => {
              openSettings();
            }}>
            <View className="mt-5 bg-primaryColor px-5 py-4 rounded-full">
              <FontText weight="Bold" className="">
                GRANT PERMISSIONS
              </FontText>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <>
      <BottomSheetModalProvider>
        <View className="flex-1 bg-primaryColor">{user && <BottomTab />}</View>
        {/* Set Messgae Modal */}
        {
          <BottomSheetModal
            backgroundStyle={{
              backgroundColor: '#131417',
            }}
            handleIndicatorStyle={{
              backgroundColor: '#fff',
            }}
            ref={alertMessageModalRef}
            index={0}
            snapPoints={alertMessageModalSnapPoints}>
            <MessageInfoBottomModal />
          </BottomSheetModal>
        }
        {/* Add To Fav Modal */}
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: '#131417',
          }}
          handleIndicatorStyle={{
            backgroundColor: '#fff',
          }}
          ref={addToFavModalRef}
          index={0}
          snapPoints={addToFavModalSnapPoints}>
          <AddToFavBottomModal />
        </BottomSheetModal>
        {/* View Fav Modal */}
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: '#131417',
          }}
          handleIndicatorStyle={{
            backgroundColor: '#fff',
          }}
          ref={viewFavModalRef}
          index={0}
          snapPoints={viewFavModalSnapPoints}>
          <ViewFavorites />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default UserStack;
