import {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const AuthContextProvider = props => {
  const [showOnBoard, setShowOnBoard] = useState(true);
  const [auth, setAuth] = useState(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const showOnBoardData = await AsyncStorage.getItem('ON_BOARD');
        if (showOnBoardData) setShowOnBoard(false);
        const authData = await AsyncStorage.getItem('AUTH_ID');
        if (authData) setAuth(authData);
      } catch (error) {
        console.log(error);
      } finally {
        setAppLoading(false);
      }
    }
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        showOnBoard,
        setShowOnBoard,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => {
  return useContext(AuthContext);
};
