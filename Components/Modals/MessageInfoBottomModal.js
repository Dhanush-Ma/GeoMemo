import {
  View,
  Text,
  StatusBar,
  TextInput,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {useEffect, useState, useMemo} from 'react';
import FontText from '../FontText';
import LottieView from 'lottie-react-native';
// import {Dropdown} from 'react-native-element-dropdown';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Contacts from 'react-native-contacts';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {useUserContext} from '../../Contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsAndroid from 'react-native-get-sms-android';
import Dropdown from '../Dropdown/Dropdown';

const MessageInfoBottomModal = () => {
  const {
    coords,
    setCurrentAlert,
    currentAlert,
    userCurrentLocation,
    alertMessageModal,
    setCoords,
  } = useUserContext();
  const flag = currentAlert ? 'edit' : 'false';
  const {height} = useWindowDimensions();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contact, setContact] = useState({
    displayName: currentAlert ? currentAlert.contact.displayName : '',
    phoneNumber: currentAlert ? currentAlert.contact.phoneNumber : '',
  });
  const [message, setMessage] = useState(
    currentAlert ? currentAlert.message : '',
  );
  const [confirmModal, setConfirmModal] = useState(false);

  const handleMessage = async () => {
    if (coords.lat && coords.lng && contact.displayName && message) {
      console.log(flag);
      let details = null;
      if (flag === 'edit') {
        details = {
          lat: currentAlert.lat,
          lng: currentAlert.lng,
          contact: contact,
          message: message.trim(),
        };
      } else {
        details = {
          lat: coords.lat,
          lng: coords.lng,
          contact: contact,
          message: message.trim(),
        };
      }
      await AsyncStorage.setItem('CURRENT_ALERT', JSON.stringify(details));

      setCoords({
        lat: userCurrentLocation.lat,
        lng: userCurrentLocation.lng,
      });
      setCurrentAlert(details);
      setConfirmModal(true);
    }
  };

  // const renderItem = item => {
  //   return (

  //   );
  // };

  const contacts = useMemo(() => {
    return Contacts.getAll().then(data => {
      const contacts = data.reduce((acc, contact) => {
        const {displayName, phoneNumbers} = contact;
        if (phoneNumbers && phoneNumbers.length > 0) {
          phoneNumbers.forEach(phoneNumber => {
            const value = phoneNumber.number.replace(/\s/g, '');
            if (value) {
              acc.push({
                displayName: displayName,
                phoneNumber: value,
              });
            }
          });
        }
        return acc;
      }, []);

      // Remove duplicate contacts
      return contacts.filter((contact, index) => {
        const _contact = JSON.stringify(contact);
        return (
          index ===
          contacts.findIndex(obj => {
            return JSON.stringify(obj) === _contact;
          })
        );
      });
    });
  }, []);

  useEffect(() => {
    contacts.then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="flex  justify-center items-center h-[50%] w-full">
        <ActivityIndicator size={60} color="#8766eb" />
      </View>
    );
  }

  return (
    <>
      {data && (
        <View className="bg-primaryColor p-7 pt-0 rounded-xl justify-center items-start h-[55%]">
          {confirmModal ? (
            <ConfirmModal />
          ) : (
            <>
              <Dropdown
                value={contact}
                data={data}
                onFocus={() => {
                  alertMessageModal.alertMessageModalRef.current.snapToIndex(1);
                }}
                onChange={item => {
                  alertMessageModal.alertMessageModalRef.current.snapToIndex(0);
                  console.log(item);
                  setContact({
                    displayName: item.displayName,
                    phoneNumber: item.phoneNumber,
                  });
                }}
              />
              <TextInput
                onChangeText={text => setMessage(text)}
                className="text-textColor border-2 border-accentColor2 rounded-md px-3 w-full"
                cursorColor={'white'}
                style={[
                  {fontFamily: `Montserrat-Regular`, textAlignVertical: 'top'},
                ]}
                placeholder="Message (Max 200 characters)"
                placeholderTextColor="white"
                maxLength={200}
                keyboardType="default"
                multiline={true}
                numberOfLines={6}
                value={message}
              />
              <Pressable
                onPress={handleMessage}
                className="bg-accentColor2 rounded-md mt-5 p-2 w-full">
                <FontText
                  weight="Medium"
                  className="text-center text-xl font-medium tracking-widest">
                  SAVE
                </FontText>
              </Pressable>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default MessageInfoBottomModal;

const ConfirmModal = () => {
  const {alertMessageModal} = useUserContext();
  const {alertMessageModalRef, handleAlertMessageModal} = alertMessageModal;

  useEffect(() => {
    setTimeout(() => {
      handleAlertMessageModal(alertMessageModalRef, 'close');
    }, 3000);
  }, []);

  return (
    <LottieView
      source={require('../../Assets/lottie/confirm.json')}
      style={{width: '100%', height: '100%'}}
      autoPlay
      loop={false}
    />
  );
};
