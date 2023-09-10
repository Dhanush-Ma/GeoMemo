import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {Text} from 'react-native';
import AuthContextProvider from './Contexts/AuthContext';
import UserContextProvider from './Contexts/UserContext';
import RouterMain from './Router';

function App() {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <RouterMain />
      </UserContextProvider>
    </AuthContextProvider>
  );
}

export default App;
