import AsyncStorage from '@react-native-async-storage/async-storage';

async function updateAuthIdToStorage(uid, setAuth) {
  try {
    await AsyncStorage.setItem('AUTH_ID', uid);
    setAuth(uid);
    console.log('all ok');
  } catch (e) {
    console.log('Failed to store the input to storage');
  }
}

module.exports = updateAuthIdToStorage;
