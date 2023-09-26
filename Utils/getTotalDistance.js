import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import getDistanceFromLatLonInKm from './getDistanceBetweenTwoLocation';

export default function getTotalDistance(locationData) {
  let totalDistance = 0;

  for (let i = 1; i < locationData.length; i++) {
    const {lat: lat1, lng: lng1} = locationData[i - 1];
    const {lat: lat2, lng: lng2} = locationData[i];

    const distance = getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
    if (distance >= 0.03) totalDistance += distance;
  }

  if (totalDistance.toFixed(2) < 1) return 0.0;
  return totalDistance.toFixed(2);
}
