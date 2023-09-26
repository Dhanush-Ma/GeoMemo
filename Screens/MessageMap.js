import {View, Text, Button, StatusBar, Pressable} from 'react-native';
import {useState, useMemo, useRef, useCallback} from 'react';
import {
  LatLng,
  LeafletView,
  AnimationType,
  INFINITE_ANIMATION_ITERATIONS,
  MapShapeType,
} from 'react-native-leaflet-view';
import FontText from '../Components/FontText';
import MessageInfoBottomModal from '../Components/Modals/MessageInfoBottomModal';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {TouchableWithoutFeedback} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {useUserContext} from '../Contexts/UserContext';
import ErrorModal from '../Components/ErrorModal';
import getDistanceFromLatLonInKm from '../Utils/getDistanceBetweenTwoLocation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MatrialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {MotiView} from 'moti';
import closeAllOpeningModals from '../Utils/closeAllOpeningModals';
// import {MotiPressable} from 'moti';
const MessageMap = () => {
  const {
    coords,
    setCoords,
    alertMessageModal,
    addToFavModal,
    viewFavModal,
    currentAlert,
    userCurrentLocation,
    error,
    setError,
  } = useUserContext();
  const {alertMessageModalRef, handleAlertMessageModal} = alertMessageModal;
  const {addToFavModalRef, handleAddToFavModal} = addToFavModal;
  const {viewFavModalRef, handleViewFavModal} = viewFavModal;

  const [mapCenter, setMapCenter] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const onMessageReceived = message => {
    if (message.event === 'onMapClicked' && currentAlert === null) {
      //console.log(message);
      closeAllOpeningModals(alertMessageModal, addToFavModal, viewFavModal);
      const newCoords = {
        lat: message.payload.touchLatLng.lat,
        lng: message.payload.touchLatLng.lng,
      };

      setMapCenter(false);
      setCoords(newCoords);
    }
  };

  const mapMarkers = [
    {
      id: 'currentPosition',
      position: coords,
      icon: '📍',
      size: [32, 32],
    },
  ];

  const mapShapes = [
    {
      shapeType: MapShapeType.CIRCLE_MARKER,
      color: '#123123',
      id: 'currentPosition',
      center: coords,
      radius: 50,
    },
  ];

  if (currentAlert) {
    mapMarkers.push({
      position: {lat: currentAlert.lat, lng: currentAlert.lng},
      id: 'currentAlert',
      icon: '📨',
      size: [32, 32],
    });

    mapShapes.push({
      shapeType: MapShapeType.CIRCLE_MARKER,
      color: '#123123',
      id: 'currentAlert',
      center: {lat: currentAlert.lat, lng: currentAlert.lng},
      radius: 50,
    });
  }

  const handleSetMessage = () => {
    if (currentAlert) {
      setShowMenu(false);
      setTimeout(() => {
        setError('Currently, you can set only one message!');
      }, 100);

      return;
    }

    // if (
    //   getDistanceFromLatLonInKm(
    //     userCurrentLocation.lat,
    //     userCurrentLocation.lng,
    //     coords.lat,
    //     coords.lng,
    //   ) <= 1.0
    // ) {
    //   setShowMenu(false);
    //   setTimeout(() => {
    //     setError(
    //       'Messages cannot be set for locations within a 1km radius of your current location.',
    //     );
    //   }, 100);

    //   return;
    // }
    closeAllOpeningModals(undefined, addToFavModal, viewFavModal);
    setShowMenu(false);
    console.log('here');
    setTimeout(() => {
      handleAlertMessageModal(alertMessageModalRef, 'open');
    }, 90);
  };

  const handleViewFavorites = async () => {
    closeAllOpeningModals(alertMessageModal, addToFavModal, undefined);
    setShowMenu(false);
    setTimeout(() => {
      handleViewFavModal(viewFavModalRef, 'open');
    }, 90);
  };

  const handleAddToFavorites = () => {
    closeAllOpeningModals(alertMessageModal, undefined, viewFavModal);
    setShowMenu(false);
    setTimeout(() => {
      handleAddToFavModal(addToFavModalRef, 'open');
    }, 90);
  };

  const options = [
    {
      desc: 'Set Message',
      icon: (
        <MatrialCommunityIcons name="message-text" size={30} color="white" />
      ),
      handleFunction: handleSetMessage,
    },
    {
      desc: 'View Favorites',
      icon: <MaterialIcons name="favorite" size={30} color="white" />,
      handleFunction: handleViewFavorites,
    },
    {
      desc: `Add Loaction to Favorites`,
      icon: <MaterialIcons name="add-comment" size={30} color="white" />,
      handleFunction: handleAddToFavorites,
    },
  ];

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 relative">
        <LeafletView
          zoomControl={false}
          doDebug={false}
          onMessageReceived={onMessageReceived}
          mapMarkers={mapMarkers}
          mapCenterPosition={mapCenter ? coords : null}
          mapShapes={mapShapes}
        />
        <Pressable
          onPress={() => {
            setShowMenu(!showMenu);
          }}
          style={{
            top: StatusBar.currentHeight + 15,
          }}
          className="absolute bg-accentColor2 right-5 p-2 rounded-full z-30 rounded-bl-none">
          {showMenu ? (
            <MotiView
              from={{scale: 0}}
              animate={{scale: 1}}
              transition={{
                duration: 500,
              }}>
              <EntypoIcon name="cross" size={40} color="white" />
            </MotiView>
          ) : (
            <MotiView>
              <EntypoIcon name="menu" size={40} color="white" />
            </MotiView>
          )}
        </Pressable>
        {showMenu && (
          <View
            className="absolute right-6 flex rounded-md justify-between"
            style={{
              top: StatusBar.currentHeight + 80,
            }}>
            {options.map((option, index) => (
              <Pressable key={index} onPress={option.handleFunction}>
                <MotiView
                  from={{translateX: -5}}
                  animate={{translateX: 0}}
                  transition={{
                    duration: 200,
                    type: 'spring',
                  }}
                  className="flex-row justify-end items-center p-3 self-end bg-accentColor2 mb-2 rounded-lg">
                  <MotiView
                    from={{translateX: 5}}
                    animate={{translateX: 0}}
                    transition={{
                      duration: 100,
                      type: 'spring',
                    }}>
                    <FontText
                      weight={'Bold'}
                      className="text-white text-base mr-3">
                      {option.desc}
                    </FontText>
                  </MotiView>
                  <MotiView
                    from={{translateX: -5}}
                    animate={{translateX: 0}}
                    transition={{
                      type: 'spring',
                      duration: 500,
                    }}>
                    {option.icon}
                  </MotiView>
                </MotiView>
              </Pressable>
            ))}
          </View>
        )}

        {error && <ErrorModal text={error} setError={setError} />}
      </View>
    </BottomSheetModalProvider>
  );
};

export default MessageMap;
