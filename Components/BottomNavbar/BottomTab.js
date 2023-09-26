import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../../Screens/UserScreens/Home';
import Settings from '../../Screens/UserScreens/Settings';
import Timeline from '../../Screens/UserScreens/Timeline';
import Messages from '../../Screens/UserScreens/Messages';

import BottomTabStyles from './BottomTabStyles';
import {View} from 'react-native';
import LocationShare from '../../Screens/UserScreens/LocationShare';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <BottomTabStyles {...props} />}>
      <Tab.Group>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Messages" component={Messages} />
        <Tab.Screen name="Timeline" component={Timeline} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default BottomTab;
