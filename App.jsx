import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {Text} from 'react-native';
import AuthContextProvider from './Contexts/AuthContext';
import UserContextProvider from './Contexts/UserContext';
import RouterMain from './Router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App() {
  
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthContextProvider>
        <UserContextProvider>
          <RouterMain />
        </UserContextProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
