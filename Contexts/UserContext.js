import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
export const UserContext = createContext();
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContextProvider = props => {
  const [user, setUser] = useState(null);
  const [coords, setCoords] = useState(null);
  const [userCurrentLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');
  const [currentAlert, setCurrentAlert] = useState(null);

  const [alertMessageModal] = useState({
    alertMessageModalRef: useRef(null),
    alertMessageModalSnapPoints: useMemo(() => ['95%'], []),
    handleAlertMessageModal: useCallback((currRef, flag) => {
      if (flag === 'close') {
        currRef.current?.dismiss();
        return;
      }

      currRef.current?.present();
    }, []),
  });

  const [uploadPhotoModal] = useState({
    uploadPhotoModalRef: useRef(null),
    uploadPhotoModalSnapPoints: useMemo(() => ['100%'], []),
    handleUploadPhotoModal: useCallback((currRef, flag, imageUri) => {
      if (flag === 'close') {
        currRef.current?.dismiss();
        return;
      }

      console.log(imageUri);
      currRef.imageUri = imageUri;
      currRef.current?.present();
    }, []),
  });

  const [viewFavModal] = useState({
    viewFavModalRef: useRef(null),
    viewFavModalSnapPoints: useMemo(() => ['65%'], []),
    handleViewFavModal: useCallback((currRef, flag) => {
      if (flag === 'close') {
        currRef.current?.dismiss();
        return;
      }

      currRef.current?.present();
    }, []),
  });

  const [addToFavModal] = useState({
    addToFavModalRef: useRef(null),
    addToFavModalSnapPoints: useMemo(() => ['65%'], []),
    handleAddToFavModal: useCallback((currRef, flag) => {
      if (flag === 'close') {
        currRef.current?.dismiss();
        return;
      }

      currRef.current?.present();
    }, []),
  });

  const [scheduleMessageModal] = useState({
    scheduleMessageModalRef: useRef(null),
    scheduleMessageModalSnapPoints: useMemo(() => ['95%'], []),
    handleScheduleMessageModal: useCallback((currRef, flag) => {
      if (flag === 'close') {
        currRef.current?.dismiss();
        return;
      }

      currRef.current?.present();
    }, []),
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Get the user's current location
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setUserLocation({lat: latitude, lng: longitude});
            setCoords({lat: latitude, lng: longitude});
          },
          error => {
            console.error('Error getting location:', error);
          },
        );

        // Retrieve and set the current alert from AsyncStorage
        const res = await AsyncStorage.getItem('CURRENT_ALERT');
        if (res !== null) {
          setCurrentAlert(JSON.parse(res));
        }
      } catch (error) {
        console.error('Error retrieving user info:', error);
      }
    };

    getUserInfo();
  }, []);

  return (
    <>
      {
        <UserContext.Provider
          value={{
            user,
            setUser,
            userCurrentLocation,
            setUserLocation,
            alertMessageModal,
            addToFavModal,
            viewFavModal,
            scheduleMessageModal,
            currentAlert,
            uploadPhotoModal,
            setCurrentAlert,
            coords,
            setCoords,
            error,
            setError,
          }}>
          {props.children}
        </UserContext.Provider>
      }
    </>
  );
};

export default UserContextProvider;

export const useUserContext = () => {
  return useContext(UserContext);
};
