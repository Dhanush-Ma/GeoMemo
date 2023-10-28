export function areCoordinatesClose(
  lat1,
  lon1,
  lat2,
  lon2,
  radiusInKilometers = 0.17,
) {
  // Convert latitude and longitude from degrees to radians
  const toRadians = angle => (angle * Math.PI) / 180;
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Radius of the Earth in kilometers
  const earthRadius = 6371; // Approximately 6371 kilometers

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  // Check if the distance is within the specified radius
  return distance <= radiusInKilometers;
}
