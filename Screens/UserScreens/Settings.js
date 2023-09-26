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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontText from '../../Components/FontText';
import getFormattedTime from '../../Utils/getFormattedTime';
import {useUserContext} from '../../Contexts/UserContext';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import signout from '../../Utils/signout';
import ErrorModal from '../../Components/ErrorModal';
import {useAuthContext} from '../../Contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
const Settings = () => {
  const [locations, setLocations] = useState([]);
  const {user, currentAlert, setError, error, auth} = useUserContext();
  const {setAuth} = useAuthContext();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const {username, phoneNumber, email} = user;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLocations = async () => {
      let locationInfo = await AsyncStorage.getItem('LOCATION_INFO');
      locationInfo = locationInfo ? JSON.parse(locationInfo) : [];

      setLocations(locationInfo);
    };

    // getLocations();
  }, []);

  const handleSignOut = async () => {
    // if (currentAlert) {
    //   setConfirmLogout(true);
    //   console.log('here');
    //   return;
    // }
    await AsyncStorage.clear();
    await signout(setAuth);
  };

  const handleDebugOutput = async () => {
    let data = await AsyncStorage.getItem('ERROR');
    let msgData = await AsyncStorage.getItem('MSG');
    data = JSON.parse(data);
    msgData = JSON.parse(msgData);
    // if (data === null ) {
    //   console.log('here');
    //   setError('No debug errors found! Not noyified the developer.');
    //   console.log(user.uid);
    //   return;
    // }
    console.log('it');
    setLoading(true);
    const document = await firestore().collection('Debug').doc(user.uid).get();
    if (document.exists) {
      await firestore()
        .collection('Debug')
        .doc(user.uid)
        .update({
          debug: firestore.FieldValue.arrayUnion({
            timestamp: Date.now(),
            error: data,
            msgData: msgData

          }),
        });
    } else {
      await firestore()
        .collection('Debug')
        .doc(user.uid)
        .set({
          username: username,
          debug: [
            {
              timestamp: Date.now(),
              error: data,
              msgData: msgData,
            },
          ],
        });
    }
    setLoading(false);
  };
  AsyncStorage.getItem('ERROR').then((data) => {
    console.log(data)
  })
  return (
    <>
      <ScrollView
        style={{paddingTop: StatusBar.currentHeight + 30}}
        className="flex-1 bg-primaryColor px-5">
        <View className="pb-20">
          <FontText className="text-3xl text-center mb-5">PROFILE</FontText>
          <View className="border-2 border-white mx-auto p-5 rounded-full py-5">
            <FontAwesome6Icon name="user-large" size={60} />
          </View>
          <View className="bg-primaryColor my-5 px-4 rounded-md divide-y-2 divide-accentColor2">
            <View className="py-5 ">
              <FontText className="text-md">Username</FontText>
              <FontText className="text-2xl font-medium">{username}</FontText>
            </View>
            <View className="py-5">
              <FontText className="text-md">Email</FontText>
              <FontText className="text-2xl font-medium">{email}</FontText>
            </View>
            <View className="py-5">
              <FontText className="text-md">Phone Number</FontText>
              <FontText className="text-2xl font-medium">
                {phoneNumber}
              </FontText>
            </View>
            <View className="py-5">
              <FontText className="text-md">Message Location Radius</FontText>
              <FontText className="text-2xl font-medium">500 m</FontText>
            </View>
            <View className="py-5">
              <FontText className="text-2xl mb-0.5 font-medium">
                Send Messages on Whatsapp
              </FontText>
              <FontText className="bg-[#581c87] text-[#d8b4fe] text-xs font-medium px-2.5 py-1.5 rounded-md  self-start">
                Coming Soon
              </FontText>
            </View>
            <Pressable onPress={handleSignOut} className="py-5">
              <View className="flex-row items-center justify-between py-3 bg-accentColor2 px-3 rounded-xl self-start">
                <FontText className="text-md font-medium mr-5 text-xl">
                  Logout
                </FontText>
                <MaterialIcons name="logout" size={20} />
              </View>
            </Pressable>
            <Pressable
              className="py-5"
              onPress={() =>
                Linking.openURL('https://dhansuh-mahesh.netlify.app')
              }>
              <View className="flex-row items-center justify-between py-3 bg-accentColor2 px-3 rounded-xl self-start">
                <FontText className="text-md font-medium mr-5 text-xl">
                  Developer
                </FontText>
                <MaterialIcons name="developer-mode" size={20} />
              </View>
            </Pressable>
            <TouchableOpacity
              className="py-5 w-full"
              onPress={() => {
                handleDebugOutput();
              }}>
              <View className="flex-row items-center justify-between py-3 bg-accentColor2 px-3 rounded-xl">
                {loading ? (
                  <ActivityIndicator
                    size={30}
                    color={'#fff'}
                    className="mx-auto"
                  />
                ) : (
                  <FontText className="text-md font-medium mr-5 text-md">
                    Send Debug Output to Developer. (Not Available in
                    production!)
                  </FontText>
                )}
              </View>
            </TouchableOpacity>
          </View>
          {error && <ErrorModal text={error} setError={setError} />}
        </View>
      </ScrollView>
      {confirmLogout && (
        <Pressable
          className="bg-black/70 absolute w-screen h-screen"
          onPress={() => setConfirmLogout(false)}>
          <Pressable
            onPress={() => {}}
            className="bg-accentColor2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 z-10">
            <FontText>Are you sure!</FontText>
          </Pressable>
        </Pressable>
      )}
    </>
  );
};

export default Settings;

/**
 {locations.length > 0 && (
        <View className="pb-10">
          {locations.map((location, idx) => {
            return (
              <View key={idx} className="pb-8">
                <FontText>{location.latitude}</FontText>
                <FontText>{location.longitude}</FontText>
                <FontText>{getFormattedTime(location.timeStamp)}</FontText>
              </View>
            );
          })}
        </View>
      )} 
 */
