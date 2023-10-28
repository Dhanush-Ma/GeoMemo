import {
  View,
  Text,
  Button,
  StatusBar,
  Pressable,
  ScrollView,
  BackHandler,
} from 'react-native';
import {useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {
  LatLng,
  LeafletView,
  AnimationType,
  INFINITE_ANIMATION_ITERATIONS,
  MapShapeType,
} from 'react-native-leaflet-view';
import locationPoint from '../Assets/location-point.png';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {MotiView} from 'moti';
import closeAllOpeningModals from '../Utils/closeAllOpeningModals';

const MessageMap = () => {
  const {
    coords,
    setCoords,
    alertMessageModal,
    addToFavModal,
    viewFavModal,
    currentAlert,
    scheduleMessageModal,
    userCurrentLocation,
    error,
    setError,
    user,
    setShowHowToModal,
  } = useUserContext();
  const {alertMessageModalRef, handleAlertMessageModal} = alertMessageModal;
  const {addToFavModalRef, handleAddToFavModal} = addToFavModal;
  const {viewFavModalRef, handleViewFavModal} = viewFavModal;
  // const {scheduleMessageModalRef, handleScheduleMessageModal} = scheduleMessdageModal;

  const [mapCenter, setMapCenter] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeAllOpeningModals(alertMessageModal, addToFavModal, viewFavModal);

        return () => {
          backHandler.remove();
        };
      },
    );
  }, []);

  const onMessageReceived = message => {
    if (message.event === 'onMapClicked') {
      closeAllOpeningModals(alertMessageModal, addToFavModal, viewFavModal);
      const newCoords = {
        lat: message.payload.touchLatLng.lat,
        lng: message.payload.touchLatLng.lng,
      };

      if (showMenu) setShowMenu(false);
      setMapCenter(false);
      setCoords(newCoords);
    }
  };

  const iterationCount = 'infinite';

  const mapMarkers = [
    {
      id: 'currentPosition',
      position: coords,
      icon: '📍',
      size: [32, 32],
      animation: {
        duration: 1,
        iterationCount,
        type: AnimationType.JUMP,
      },
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
      animation: {
        duration: 0.4,
        iterationCount,
        type: AnimationType.WAGGLE,
      },
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
    setTimeout(() => {
      handleAlertMessageModal(alertMessageModalRef, 'open');
    }, 90);
  };

  const handleViewFavorites = async () => {
    // closeAllOpeningModals(alertMessageModal, addToFavModal, undefined);
    if (showMenu) setShowMenu(false);
    // setTimeout(() => {
    handleViewFavModal(viewFavModalRef, 'open');
    // }, 90);
  };

  const handleAddToFavorites = () => {
    closeAllOpeningModals(alertMessageModal, undefined, viewFavModal);
    setShowMenu(false);
    setTimeout(() => {
      handleAddToFavModal(addToFavModalRef, 'open');
    }, 90);
  };

  const handleScheduleMessage = () => {
    closeAllOpeningModals(alertMessageModal, undefined, viewFavModal);
    setShowMenu(false);
    setTimeout(() => {
      handleScheduleMessageModal(scheduleMessageModalRef, 'open');
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
    // {
    //   desc: `Schedule Messages`,
    //   icon: <MaterialIcons name="schedule-send" size={30} color="white" />,
    //   handleFunction: handleScheduleMessage,
    // },
    {
      desc: `Add Loaction to Favorites`,
      icon: <MaterialIcons name="add-comment" size={30} color="white" />,
      handleFunction: handleAddToFavorites,
    },
  ];

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 relative">
        <StatusBar translucent backgroundColor="transparent" />

        <LeafletView
          zoomControl={false}
          doDebug={false}
          onMessageReceived={onMessageReceived}
          mapMarkers={mapMarkers}
          mapCenterPosition={mapCenter ? coords : null}
          mapShapes={mapShapes}
          mapLayers={[
            {
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
          ]}
        />
        <Pressable
          onPress={() => {
            setShowMenu(!showMenu);
          }}
          style={{
            top: StatusBar.currentHeight + 15,
          }}
          className="absolute bg-accentColor2 right-5 p-2 rounded-full rounded-bl-none">
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
