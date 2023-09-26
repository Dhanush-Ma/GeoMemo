import SmsAndroid from 'react-native-get-sms-android';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function snedMessageToUser(contact, message) {
  try {
    SmsAndroid.autoSend(
      contact.phoneNumber, // Recipient's phone number
      message, // SMS message body
      async fail => {
        console.log('Failed with code: ' + fail);
        await AsyncStorage.mergeItem('ERROR', JSON.stringify(fail));
      },
      async success => {
        console.log('SMS sent successfully with ID: ' + success);
        await AsyncStorage.mergeItem(
          'MSG',
          JSON.stringify({data: success, timestamp: Date.now()}),
        );
      },
    );
  } catch (error) {
    console.log(error);
    await AsyncStorage.mergeItem('ERROR', JSON.stringify(error));
  }
}

module.exports = snedMessageToUser;
