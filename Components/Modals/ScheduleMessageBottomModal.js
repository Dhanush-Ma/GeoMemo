import {View, Text, Pressable} from 'react-native';
import FontText from '../FontText';
import { useEffect } from 'react';

const ScheduleMessageBottomModal = () => {
  const handleScheduleMessage = async () => {};

  return (
    <View className="px-7 py-8">
      <Pressable
        onPress={handleScheduleMessage}
        className="bg-accentColor2 rounded-md mt-5 p-2 w-full">
        <FontText
          weight="Medium"
          className="text-center text-xl font-medium tracking-widest">
          SCHEDULE
        </FontText>
      </Pressable>
    </View>
  );
};

export default ScheduleMessageBottomModal;
