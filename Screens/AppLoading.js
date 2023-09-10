import {View, Text, useWindowDimensions} from 'react-native';

const AppLoading = () => {
    const {width, height} = useWindowDimensions();
  return (
    <View width={width} height={height} className="bg-primaryColor justify-center items-center ">
      <Text className="text-white text-center text-xl" >AppLoading</Text>
    </View>
  )
}

export default AppLoading