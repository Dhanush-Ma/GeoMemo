import AuthStack from './Stack/AuthStack';
import UserStack from './Stack/UserStack';
import AppLoading from './Screens/AppLoading';
import {NavigationContainer} from '@react-navigation/native';
import {useAuthContext} from './Contexts/AuthContext';
import OnBoard from './Screens/OnBoard';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RouterMain = () => {
  const {auth, appLoading, showOnBoard} = useAuthContext();

  useEffect(() => {
    const setDate = async () => {
      const isDateSet = await AsyncStorage.getItem('TODAY_DATE');

      if (!isDateSet) {
        return;
      }

      await AsyncStorage.setItem(
        'TODAY_DATE',
        JSON.stringify(new Date().getDate()),
      );
    };

    setDate();
  }, []);

  if (appLoading) {
    return <AppLoading />;
  }

  if (showOnBoard) {
    return <OnBoard />;
  }

  return (
    <NavigationContainer>
      {auth ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RouterMain;
