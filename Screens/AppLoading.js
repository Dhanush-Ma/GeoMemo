import {View, Text, useWindowDimensions, StatusBar, Image} from 'react-native';

const AppLoading = () => {
  const {width, height} = useWindowDimensions();
  return (
    <View
      width={width}
      height={height}
      className="bg-primaryColor justify-center items-center ">
      <StatusBar backgroundColor="#131417" />
      <View className="w-[80%] h-[90%]">
        <Image
          source={require('../Assets/logo.jpg')}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default AppLoading;
