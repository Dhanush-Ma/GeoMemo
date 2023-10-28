import {View, Text, TouchableOpacity, Pressable} from 'react-native';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icons from 'react-native-vector-icons/FontAwesome6';
import FontText from '../FontText';

function BottomTabStyles({state, descriptors, navigation}) {
  const icons = {
    Home: {func: FoundationIcons, name: 'home', label: 'Home'},
    Messages: {func: FontAwesome6Icons, name: 'message', label: 'Messages'},
    Timeline: {func: FontAwesome5Icons, name: 'route', label: 'Timeline'},
    // LocationShare: {func: FontAwesome6Icons, name: 'map-location-dot'},
    Settings: {func: IoniconsIcons, name: 'settings', label: 'Settings'},
  };

  return (
    <View
      style={{flexDirection: 'row'}}
      className="bg-secondaryColor1 p-1  rounded-full w-[90%] mx-auto my-4">
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const Icon = icons[label].func;
        const name = icons[label].name;
        const labelName = icons[label].label;

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{
              backgroundColor: isFocused ? '#8766eb' : 'transparent',
            }}
            className="flex flex-1 justify-center items-center py-2  rounded-full h-[60px]">
            <View className="flex justify-center items-center">
              <Icon name={name} size={20} color="white" />
              <FontText className="text-xs">{labelName}</FontText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default BottomTabStyles;
