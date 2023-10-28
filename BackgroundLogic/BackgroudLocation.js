import NetInfo from '@react-native-community/netinfo';
import checkUserReachedMessageLocation from './checkUserReachedMessageLocation';
import getFormattedDate from '../Utils/getFormattedDate';
import SmsAndroid from 'react-native-get-sms-android';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import getFormattedTime from '../Utils/getFormattedTime';

export default backgroundLoaction = async (position, auth, setCurrentAlert) => {
  const {latitude, longitude} = position.coords;

  // 1)
  let messageInfo = await AsyncStorage.getItem('CURRENT_ALERT');
  messageInfo = messageInfo !== null ? JSON.parse(messageInfo) : null;
  let messageProgressInfo = await AsyncStorage.getItem('MSG_PROGRESS');

  console.log(messageProgressInfo);
  // check user reached the location if message info is not null
  if (
    messageInfo &&
    checkUserReachedMessageLocation(
      latitude,
      longitude,
      messageInfo.lat,
      messageInfo.lng,
    ) &&
    messageProgressInfo == null
  ) {
    await AsyncStorage.setItem('MSG_PROGRESS', 'progress');
    SmsAndroid.autoSend(
      messageInfo.contact.phoneNumber,
      messageInfo.message,
      async fail => {
        try {
          const removedMessage = {
            ...messageInfo,
            status: 'Not Sent',
            timeStamp: Date.now(),
          };

          await firestore()
            .collection('Users')
            .doc(auth)
            .update({
              previous_messages:
                firestore.FieldValue.arrayUnion(removedMessage),
            });

          await AsyncStorage.removeItem('CURRENT_ALERT');
          setCurrentAlert(null);

          // Send PUSH notification to user
          PushNotification.localNotification({
            channelId: 'GeoMemo',
            title: 'Scheduled Message not sent :(',
            message: `We apologize, your scheduled message to ${messageInfo.contact.displayName} could not be sent.`,
            playSound: true,
          });

          await AsyncStorage.removeItem('MSG_PROGRESS');
        } catch (error) {
          console.log(error);
        }
      },
      async success => {
        try {
          console.log('SMS sent successfully with ID: ' + success);
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

          await AsyncStorage.removeItem('CURRENT_ALERT');
          setCurrentAlert(null);

          // Send PUSH notification to user
          PushNotification.localNotification({
            channelId: 'GeoMemo',
            title: 'Scheduled Message sent',
            message: `Your scheduled message to ${messageInfo.contact.displayName} is sent successfully`,
            playSound: true,
          });

          await AsyncStorage.removeItem('MSG_PROGRESS');
        } catch (error) {}
      },
    );
  }

  // 2)
  // update every location to AsyncStorage
  let locationInfo = await AsyncStorage.getItem('LOCATION_INFO');
  locationInfo = locationInfo !== null ? JSON.parse(locationInfo) : null;

  if (locationInfo !== null) {
    const lastLocation = locationInfo[locationInfo.length - 1];
    if (
      lastLocation.latitude !== latitude &&
      lastLocation.longitude !== longitude
    ) {
      // update new location
      locationInfo.push({
        latitude,
        longitude,
        timeStamp: Date.now(),
      });
      await AsyncStorage.setItem('LOCATION_INFO', JSON.stringify(locationInfo));
    }
  }
  // if location is null we have create a new set of locations for the day
  else {
    const value = JSON.stringify([
      {
        latitude,
        longitude,
        timeStamp: Date.now(),
      },
    ]);
    await AsyncStorage.setItem('LOCATION_INFO', value);
  }

  // 3)
  // check if today date is over and send to DB
  const storedDate = await AsyncStorage.getItem('TODAY_DATE');
  const todayDate = new Date().getDate();
  const state = await NetInfo.fetch();

  if (storedDate != todayDate && state.isConnected === true) {
    console.log('here');
    try {
      const currentDate = new Date();
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);
      const formattedDate = getFormattedDate(yesterdayDate);

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
      await AsyncStorage.setItem('TODAY_DATE', JSON.stringify(todayDate));
    } catch (error) {
      console.log(error);
      // await RNFS.write(
      //   `${RNFS.DownloadDirectoryPath}/geomemo.txt`,
      //   `Error occured while clearing the location info and send to DB at ${getFormattedTime(
      //     Date.now(),
      //   )}\n Error Info: ${JSON.stringify(error)}\n`,
      //   -1,
      //   'utf8',
      // );
    }
  }
};
