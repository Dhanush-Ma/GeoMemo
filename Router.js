import AuthStack from './Stack/AuthStack';
import UserStack from './Stack/UserStack';
import AppLoading from './Screens/AppLoading';
import {NavigationContainer} from '@react-navigation/native';
import {useAuthContext} from './Contexts/AuthContext';
import OnBoard from './Screens/OnBoard';

const RouterMain = () => {
  const {auth, appLoading, showOnBoard} = useAuthContext();

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
