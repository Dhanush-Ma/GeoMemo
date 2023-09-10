import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import PhoneAuth from '../Screens/PhoneAuth';

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
    </Stack.Navigator>
  );
};

export default AuthStack;
