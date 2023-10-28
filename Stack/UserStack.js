import {
  View,
  PermissionsAndroid,
  StatusBar,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl,
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
import ScheduleMessageBottomModal from '../Components/Modals/ScheduleMessageBottomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import FontText from '../Components/FontText';
import backgroundLoaction from '../BackgroundLogic/BackgroudLocation';
import AppLoading from '../Screens/AppLoading';
import {checkPermission} from 'react-native-contacts';
import ShowProfileImage from '../Components/User/ShowProfileImage';

ReactNativeForegroundService.start({
  id: 1244,
  title: 'GeoMemo',
  message: 'Accessing Background Location',
  icon: 'ic_launcher_round',
  largeIcon: 'ic_launcher_round',
});

const UserStack = () => {
  const {
    user,
    setUser,
    alertMessageModal,
    currentAlert,
    setUserLocation,
    addToFavModal,
    viewFavModal,
    scheduleMessageModal,
    setCurrentAlert,
    uploadPhotoModal,
  } = useUserContext();
  const {auth, setAuth} = useAuthContext();
  const [permissions, setPermissions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const {alertMessageModalRef, alertMessageModalSnapPoints} = alertMessageModal;
  const {addToFavModalRef, addToFavModalSnapPoints} = addToFavModal;
  const {viewFavModalRef, viewFavModalSnapPoints} = viewFavModal;
  const {uploadPhotoModalRef, uploadPhotoModalSnapPoints} = uploadPhotoModal;
  const {scheduleMessageModalRef, scheduleMessageModalSnapPoints} =
    scheduleMessageModal;

  const onRefresh = () => {
    requestPermissions();
  };

  const requestPermissions = async () => {
    const permissionsToRequest = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
    ];

    const status = await requestMultiple(permissionsToRequest);

    const deniedPermissions = Object.entries(status).filter(
      ([_, permissionStatus]) => permissionStatus === 'denied',
    );

    if (deniedPermissions.length === 0) {
      setLoading(false);
      setPermissions(true);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    try {
      ReactNativeForegroundService.add_task(
        () => {
          Geolocation.getCurrentPosition(
            position => backgroundLoaction(position, auth, setCurrentAlert),
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
              distanceFilter: 0,
            },
          );
        },
        {
          delay: 30000,
          onLoop: true,
          taskId: 'com.supersami.geoMemo',
          onError: e => console.log('Foreground Service - Error logging:', e),
          onSuccess: () => console.log('Foreground service started'),
        },
      );
    } catch (error) {
      console.log('error: ', error);
    }
  }, []);

  useEffect(() => {
    const database_subscriber = firestore()
      .collection('Users')
      .doc(auth)
      .onSnapshot(documentSnapshot => {
        setUser(documentSnapshot.data());
      });

    return () => database_subscriber();
  }, [auth]);

  if (loading) return <AppLoading />;

  if (!permissions) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1">
        <View className="flex-1 h-screen bg-primaryColor justify-center items-center">
          <View
            style={{top: StatusBar.currentHeight + 10}}
            className="absolute">
            <FontText weight={'Bold'} className="text-white text-xs">
              Pull down to refresh
            </FontText>
          </View>
          <StatusBar backgroundColor="#131417" />
          <View className="w-[90%] h-[250px] bg-accentColor2 rounded-lg flex justify-center items-center px-2">
            <FontText weight={'Medium'} className="text-xl text-center ">
              To provide you with the best app experience, we require your
              permission to access the locattion all the time.
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
      </ScrollView>
    );
  }

  return (
    <>
      <BottomSheetModalProvider>
        <View className="flex-1 bg-primaryColor relative">
          {user && <BottomTab />}
        </View>
        {/* Set Messgae Modal */}
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
        {/* {Upload Photo Modal} */}
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: '#131417',
          }}
          handleIndicatorStyle={{
            backgroundColor: '#fff',
          }}
          ref={uploadPhotoModalRef}
          index={0}
          snapPoints={uploadPhotoModalSnapPoints}>
          <ShowProfileImage />
        </BottomSheetModal>
        {/* {Schedule Message Modal} */}
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: '#131417',
          }}
          handleIndicatorStyle={{
            backgroundColor: '#fff',
          }}
          ref={scheduleMessageModalRef}
          index={0}
          snapPoints={scheduleMessageModalSnapPoints}>
          <ScheduleMessageBottomModal />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default UserStack;
