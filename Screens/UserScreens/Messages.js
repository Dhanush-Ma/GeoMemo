import {View, Text, StatusBar, Pressable, ScrollView} from 'react-native';
import {useEffect, useMemo, useState} from 'react';
import FocusAwareStatusBar from '../../Components/FocusedAwareStatusBar';
import {useUserContext} from '../../Contexts/UserContext';
import FontText from '../../Components/FontText';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import getDistanceFromLatLonInKm from '../../Utils/getDistanceBetweenTwoLocation';
import LinearGradient from 'react-native-linear-gradient';
import {MotiView} from 'moti';
import {useAuthContext} from '../../Contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getFormattedTime from '../../Utils/getFormattedTime';
import {useNavigation} from '@react-navigation/native';

const Messages = () => {
  const {auth} = useAuthContext();
  const navigation = useNavigation();
  const {alertMessageModal} = useUserContext();
  const {alertMessageModalRef, handleAlertMessageModal} = alertMessageModal;
  const {user, currentAlert, userCurrentLocation, setCurrentAlert} =
    useUserContext();
  const [previousMessages, setPreviousMessages] = useState(
    user.previous_messages,
  );


  const messagedData = useMemo(() => {
    return previousMessages.sort((a, b) => b.timeStamp - a.timeStamp);
  }, [previousMessages]);

  const handleRemoveMessage = async () => {
    const removedAlert = {
      ...currentAlert,
      status: 'Removed by you',
      timeStamp: Date.now(),
    };

    const res = await firestore()
      .collection('Users')
      .doc(auth)
      .update({
        previous_messages: firestore.FieldValue.arrayUnion(removedAlert),
      });

    await AsyncStorage.removeItem('CURRENT_ALERT');
    setCurrentAlert(null);
    setPreviousMessages(prev => [...prev, removedAlert]);
  };

  const handleEditMessage = () => {
    navigation.navigate('Home');
    handleAlertMessageModal(alertMessageModalRef, 'edit');
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingTop: StatusBar.currentHeight + 20}}
        className="bg-primaryColor flex-1 pb-5">
        <FocusAwareStatusBar backgroundColor="#131417" />
        <View className="px-4 mb-5">
          <View className="mb-5 bg-accentColor1 p-3 rounded-xl">
            <FontText
              style={{alignSelf: 'flex-start'}}
              className="text-2xl text-primaryColor border-b-2 border-b-primaryColor w-max pb-1 mb-4"
              weight={'Bold'}>
              Current Message Status
            </FontText>
            {currentAlert ? (
              <View>
                <View>
                  <FontText
                    weight={'Medium'}
                    className="text-primaryColor font-medium">
                    {currentAlert.contact.displayName} (
                    {currentAlert.contact.phoneNumber})
                  </FontText>
                  <FontText
                    weight={'Medium'}
                    className="text-primaryColor text-left text-lg">
                    {currentAlert.message}
                  </FontText>
                </View>
                <View className="flex flex-row justify-between mt-3">
                  <MotiView
                    from={{opacity: 1}} // Initial opacity
                    animate={{opacity: 0.8}} // Animated opacity
                    transition={{loop: true, type: 'timing', duration: 500}}>
                    <LinearGradient
                      colors={['#B37F0D', '#F3E676', '#B58111']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="bg-accentColor2 flex justify-center px-2 py-2 rounded-md">
                      <FontText
                        weight={'Bold'}
                        className="uppercase text-black ">
                        Distance left:{' '}
                        {getDistanceFromLatLonInKm(
                          userCurrentLocation.lat,
                          userCurrentLocation.lng,
                          currentAlert.lat,
                          currentAlert.lng,
                        ).toFixed(2)}{' '}
                        KM
                      </FontText>
                    </LinearGradient>
                  </MotiView>
                  <View className="flex flex-row  gap-x-5">
                    <Pressable onPress={handleEditMessage}>
                      <AntDesignIcon name="edit" size={30} color="#121212" />
                    </Pressable>
                    <Pressable onPress={handleRemoveMessage}>
                      <IoniconsIcon
                        name="remove-circle-outline"
                        size={30}
                        color="red"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <FontText
                weight="Medium"
                className="text-[20px] text-black leading-5">
                There are no messages currently assigned.
              </FontText>
            )}
          </View>
          <View className="mb-10 bg-accentColor2 p-3 rounded-xl">
            <FontText
              style={{alignSelf: 'flex-start'}}
              className="text-2xl text-primaryColor border-b-2 border-b-primaryColor w-max pb-1 mb-4"
              weight={'Bold'}>
              Previous Messages
            </FontText>
            {previousMessages.length > 0 ? (
              <>
                {messagedData.map((message, idx) => {
                  const statusColor = message.status.includes('Removed')
                    ? 'bg-errorColor'
                    : 'bg-successColor';
                  const statusText = message.status.includes('Removed')
                    ? 'text-white'
                    : 'text-black';

                  return (
                    <View
                      key={idx}
                      className="border-b-2 pb-4 border-b-primaryColor mb-4">
                      <FontText weight={'Medium'} className="text-primaryColor">
                        {message.contact.displayName} (
                        {message.contact.phoneNumber})
                      </FontText>
                      <FontText
                        weight={'Medium'}
                        className="text-primaryColor font-medium">
                        {getFormattedTime(message.timeStamp)}
                      </FontText>
                      <FontText
                        weight={'Medium'}
                        className="text-primaryColor text-lg mt-1 text-justify">
                        {message.message}
                      </FontText>
                      <FontText
                        weight={'Bold'}
                        style={{alignSelf: 'flex-start'}}
                        className={`${statusColor} p-2 rounded-md mt-2 ${statusText} text-left text-[10px] uppercase`}>
                        {message.status}
                      </FontText>
                    </View>
                  );
                })}
              </>
            ) : (
              <FontText
                weight={'Medium'}
                className="text-[20px] text-black  mb-5">
                No history of previous messages.
              </FontText>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Messages;
