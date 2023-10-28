import {View, Text, ScrollView, StatusBar, RefreshControl} from 'react-native';
import React from 'react';
import MessageMap from '../MessageMap';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import FocusAwareStatusBar from '../../Components/FocusedAwareStatusBar';

const Home = () => {
  return (
    <NativeViewGestureHandler disallowInterruption={true}>
      <View className="bg-primaryColor flex-1">
        <FocusAwareStatusBar backgroundColor="transparent" translucent={true} />
        <MessageMap />
      </View>
    </NativeViewGestureHandler>
  );
};

export default Home;
