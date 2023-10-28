import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Button,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {useState} from 'react';
import LottieView from 'lottie-react-native';
import {useAuthContext} from '../../Contexts/AuthContext';
import {MotiView} from 'moti';
import Icon from 'react-native-vector-icons/Ionicons';
import FontText from '../FontText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnBoardSliderItem = ({
  id,
  text,
  animation,
  backgroundColor,
  textColor,
  arrowBackground,
  setIndex,
}) => {
  const {width, height} = Dimensions.get('screen');
  const {setShowOnBoard} = useAuthContext();

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} />
      {
        <MotiView
          from={{
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          backgroundColor={backgroundColor}
          width={width}
          height={height}
          className={`py-10 pb-20 px-5 justify-center items-center  relative`}>
          <Text
            className="text-3xl absolute top-10"
            style={[{fontFamily: 'CroissantOne-Regular'}]}>
            GeoMemo
          </Text>
          <View className="flex gap-y-2">
            <View
              className="mx-auto"
              style={{width: width * 0.8, height: height * 0.4}}>
              <LottieView
                source={animation}
                style={{
                  width: '100%',
                  height: '100%',
                  // marginHorizontal: 'auto',
                }}
                autoPlay
                loop
                resizeMode="contain"
              />
            </View>
            <FontText
              style={{color: textColor}}
              className="text-2xl text-center">
              {text}
            </FontText>
          </View>
          {id == 4 ? (
            <TouchableOpacity
              className="absolute bottom-20 translate-x-1/2"
              onPress={async () => {
                try {
                  await AsyncStorage.setItem('ON_BOARD', 'true');
                  console.log('Data successfully saved');
                  await setShowOnBoard(false);
                } catch (e) {
                  console.log('Failed to save the data to the storage');
                }
              }}>
              <MotiView className="bg-primaryColor py-4 px-5 rounded-2xl flex flex-row none justify-center items-center ">
                <FontText className="font-bold font-xl mr-3">
                  GET STARTED
                </FontText>
                <Icon name="arrow-forward" size={30} />
              </MotiView>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="absolute bottom-20 right-10"
              onPress={() => {
                setIndex(prev => prev + 1);
              }}>
              <MotiView
                from={{
                  translateX: -10,
                }}
                animate={{
                  translateX: 0,
                }}
                transition={{
                  loop: true,
                  type: 'timing',
                  delay: 1000,
                }}
                style={{backgroundColor: arrowBackground}}
                className="p-4 rounded-full">
                <Icon name="arrow-forward" size={30} />
              </MotiView>
            </TouchableOpacity>
          )}
        </MotiView>
      }
    </>
  );
};

export default OnBoardSliderItem;
