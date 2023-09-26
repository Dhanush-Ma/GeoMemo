import getDistanceFromLatLonInKm from './getDistanceBetweenTwoLocation';

export default function checkUserReachedMessageLocation(
  lat1,
  lon1,
  lat2,
  lon2,
) {
  const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  console.log(distance);
  if (distance >= 0.5) return false;
  return true;
}
