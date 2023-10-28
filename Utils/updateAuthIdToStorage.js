import AsyncStorage from '@react-native-async-storage/async-storage';
import getFormattedTime from './getFormattedTime';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

async function updateAuthIdToStorage(uid, setAuth, flag) {
  try {
    let fileContent = `Do not share this file with anyone. This is intended for Developers. \nCopyright 2023 GeoMemo - Dhanush Mahesh \n`;
    if (flag === 'signup') {
      fileContent += `SignUp Session: ${getFormattedTime(Date.now())}\n`;
    } else {
      fileContent += `Login Session: ${getFormattedTime(Date.now())}\n`;
    }

    await AsyncStorage.setItem('AUTH_ID', uid);
    setAuth(uid);
  } catch (e) {
    console.log('Errher', e);
  }
}

module.exports = updateAuthIdToStorage;
