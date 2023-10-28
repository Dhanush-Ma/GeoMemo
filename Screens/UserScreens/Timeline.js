import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useMemo, useState} from 'react';
import {View, Text, StatusBar, Pressable} from 'react-native';
import {LeafletView, MapShapeType, MapShape} from 'react-native-leaflet-view';
import FontText from '../../Components/FontText';
import getTotalDistance from '../../Utils/getTotalDistance';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterilaIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarModal from '../../Components/User/Calendar';
import getFormattedDate from '../../Utils/getFormattedDate';
import {useUserContext} from '../../Contexts/UserContext';
import getFormattedDateWithDay from '../../Utils/getFormattedDateWithDay';
import {firebase} from '@react-native-firebase/firestore';
import FocusAwareStatusBar from '../../Components/FocusedAwareStatusBar';

const Timeline = () => {
  const [date, setDate] = useState(getFormattedDate(new Date()));
  const [locationData, setLocationData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const {userCurrentLocation, user} = useUserContext();
  const [loc, setLoc] = useState([]);

  useEffect(() => {
    const getLocationInfo = async () => {
      if (date !== getFormattedDate(new Date())) {
        let flag = false;
        for (let i = 0; i < user.timeline.length; i++) {
          const item = user.timeline[i];

          if (item.date === date) {
            console.log(item.locationInfo.length);
            const modifiedData = item.locationInfo.map(item => ({
              lat: item.latitude,
              lng: item.longitude,
            }));
            flag = true;
            setLocationData(modifiedData);
          }
        }
        if (flag === false) setLocationData([]);
        return;
      }

      let data = await AsyncStorage.getItem('LOCATION_INFO');
      data = JSON.parse(data);
      if (data) {
        const modifiedData = data.map(item => ({
          lat: item.latitude,
          lng: item.longitude,
        }));

        setLocationData(modifiedData);
      }
    };

    const getData = async id => {
      const locData = await firebase.firestore().collection('Users').doc(id);
      const timelineArr = (await locData.get()).data().timeline;
      const arr = timelineArr[timelineArr.length - 1].locationInfo;
      console.log(arr.length);
      const data = arr.map(item => ({
        lat: item.latitude,
        lng: item.longitude,
      }));
      setLocationData(data);
      return;
    };

    //getData(id)
    getLocationInfo();
  }, [date]);

  const distance = useMemo(() => {
    return getTotalDistance(locationData);
  }, [locationData]);

  return (
    <>
      {
        <View className="bg-primaryColor flex justify-between flex-1 relative">
          <FocusAwareStatusBar translucent backgroundColor="transparent"   />
          <View className="flex flex-1 bg-secondaryColor1">
            <LeafletView
              zoomControl={false}
              doDebug={false}
              mapCenterPosition={{
                lat: userCurrentLocation.lat,
                lng: userCurrentLocation.lng,
              }}
              zoom={13}
              mapShapes={[
                {
                  shapeType: MapShapeType.POLYLINE,
                  color: '#8766eb',
                  id: '5',
                  positions: [locationData],
                },
              ]}
              mapLayers={[
                {
                  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                },
              ]}
            />
            <View
              style={{
                top: StatusBar.currentHeight + 10,
                alignSelf: 'flex-end', // Make children expand to max content width
              }}
              className="absolute right-5 flex flex-col">
              <View className="bg-accentColor2 p-3 rounded-md flex flex-row space-x-2 justify-between items-center mb-2">
                <FontText weight={'Medium'}>Distance: {distance} km</FontText>
                <MaterilaIcons name="map-marker-distance" size={20} />
              </View>
              <Pressable onPress={() => setShowCalendar(true)}>
                <View className="bg-accentColor2 p-3 rounded-md flex flex-row space-x-2 justify-between items-center self-end">
                  <FontText className="text-sm" weight={'Medium'}>
                    {getFormattedDateWithDay(date)}
                  </FontText>
                  <AntDesignIcon name="calendar" size={20} />
                </View>
              </Pressable>
            </View>
          </View>
          {showCalendar && (
            <CalendarModal
              date={date}
              setDate={setDate}
              setShowCalendar={setShowCalendar}
            />
          )}
        </View>
      }
    </>
  );
};

export default Timeline;
