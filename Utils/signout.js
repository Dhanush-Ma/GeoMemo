import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function signout(setAuth) {
  try {
    await AsyncStorage.removeItem('AUTH_ID');
    await auth().signOut();
    setAuth(null);
  } catch (e) {
    console.log(e);
  }
}

module.exports = signout;
