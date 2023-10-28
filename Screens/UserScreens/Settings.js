import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TroubleShoot from './SettingsScreens/TroubleShoot';
import Profile from './SettingsScreens/Profile';
import Report from './SettingsScreens/Report';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';

const Stack = createNativeStackNavigator();

const Settings = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const defaultScreen = 'Profile';

  useEffect(() => {
    if (isFocused) {
      navigation.navigate(defaultScreen);
    }
  }, [isFocused, navigation]);

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="TroubleShoot" component={TroubleShoot} />
        <Stack.Screen name="Report" component={Report} />
      </Stack.Navigator>
    </>
  );
};

export default Settings;
