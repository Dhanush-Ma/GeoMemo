/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen';


ReactNativeForegroundService.register();

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  popInitialNotification: true,

  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'GeoMemo',
    channelName: 'GeoMemo SMS',
    channelDescription: 'Send Notification when an SMS is sent',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`Channel created: ${created}`), 
);

AppRegistry.registerComponent(appName, () => App);
