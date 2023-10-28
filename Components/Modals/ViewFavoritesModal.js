import {View, Text, TextInput, Pressable, TouchableOpacity} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useUserContext} from '../../Contexts/UserContext';
import LottieView from 'lottie-react-native';
import {useWindowDimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontText from '../FontText';
import {firebase} from '@react-native-firebase/firestore';
import FavItem from './FavItem';
import {ScrollView} from 'react-native-gesture-handler';
import getDistanceFromLatLonInKm from '../../Utils/getDistanceBetweenTwoLocation';

const ViewFavorites = () => {
  const {
    user,
    setCoords,
    viewFavModal,
    setError,
    alertMessageModal,
    userCurrentLocation,
    currentAlert,
  } = useUserContext();
  let {favorites} = user;
  const {viewFavModalRef, handleViewFavModal} = viewFavModal;
  const {alertMessageModalRef, handleAlertMessageModal} = alertMessageModal;

  const sortedFavorites = useMemo(() => {
    return favorites.sort((a, b) => b.timestamp - a.timestamp);
  }, [favorites]);

  const handleRemoveItem = async fav => {
    console.log(fav);
    await firebase
      .firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        favorites: firebase.firestore.FieldValue.arrayRemove(fav),
      });
  };

  const handleSetFavLocation = coords => {
    if (currentAlert) {
      handleViewFavModal(viewFavModalRef, 'close');
      setTimeout(() => {
        setError('Currently, you can set only one message!');
      }, 50);

      return;
    }

    if (
      getDistanceFromLatLonInKm(
        userCurrentLocation.lat,
        userCurrentLocation.lng,
        coords.lat,
        coords.lng,
      ) <= 1.0
    ) {
      handleViewFavModal(viewFavModalRef, 'close');
      setTimeout(() => {
        setError(
          'Messages cannot be set for locations within a 1km radius of your current location.',
        );
      }, 100);

      return;
    }
    handleViewFavModal(viewFavModalRef, 'close');
    setCoords(coords);
    handleAlertMessageModal(alertMessageModalRef, 'open');
  };

  return (
    <View className="bg-primaryColor  p-7 rounded-xl justify-center items-center flex-1">
      {favorites.length > 0 ? (
        <>
          <View className="bg-accentColor1  p-3 w-full mx-auto rounded-md mb-5">
            <View className="flex flex-row items-center space-x-2 justify-center mb-1">
              <Text
                style={{fontFamily: 'CroissantOne-Regular'}}
                className="text-2xl text-center text-primaryColor">
                FAVOURITES
              </Text>
              <MaterialIcons name="favorite" color="black" size={30} />
            </View>
            <FontText weight={"Medium"} className="text-xs text-primaryColor text-center">
              Quickly compose messages for your preferred locations by clicking
              on them.
            </FontText>
          </View>
          <ScrollView
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            className="w-full h-full">
            {sortedFavorites.map((fav, index) => (
              <FavItem
                key={fav.timestamp}
                fav={fav}
                handleRemoveItem={handleRemoveItem}
                handleSetFavLocation={handleSetFavLocation}
                index={index}
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <View className="w-full h-full flex justify-center items-center">
          <FontText className="bg-accentColor2 p-2 rounded-md font-medium text-base w-full text-center">
            Looks like you don't have any favorites yet.
          </FontText>
          <LottieView
            source={require('../../Assets/lottie/empty.json')}
            style={{width: '100%', height: '80%'}}
            autoPlay
            loop
          />
        </View>
      )}
    </View>
  );
};

export default ViewFavorites;
