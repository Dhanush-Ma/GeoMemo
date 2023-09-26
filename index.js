/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'GeoMemo', // Replace with your desired channel ID
    channelName: 'GeoMemo SMS', // Replace with your desired channel name
    channelDescription: 'Send Notification when an SMS is sent', // Replace with your desired channel description
    soundName: 'default', // Sound to play for notifications on this channel (default or custom sound file)
    importance: 4, // Importance level (0-4, where 4 is the highest importance)
    vibrate: true, // Vibration for notifications on this channel
  },
  created => console.log(`Channel created: ${created}`), // Callback function
);

ReactNativeForegroundService.register();
ReactNativeForegroundService.start({
  id: 1244,
  title: 'GeoMemo',
  message: 'Accessing Background Location',
  icon: 'ic_launcher',
  largeIcon: 'ic_launcher',
});
AppRegistry.registerComponent(appName, () => App);
