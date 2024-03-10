import { validateCoordinates } from "./validators.js";

const R = 6378137;

/**
 * a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
 * c = 2 ⋅ atan2( √a, √(1−a) )
 * d = R ⋅ c
 * Where	φ is latitude in radians, λ is longitude in radians, R is earth’s radius
 * @param {{ lat: number, long: number }} startCoord
 * @param {{ lat: number, long: number }} endCoord
 * @returns {number} The distance between the two coordinates in meters.
 */
export function calculateDistanceBetweenCoordinates(
  startCoord,
  endCoord,
  precision = 2
) {
  validateCoordinates(startCoord, "startCoord");
  validateCoordinates(endCoord, "endCoord");

  const { lat: startLat, long: startLong } = startCoord;
  const { lat: endLat, long: endLong } = endCoord;

  // Convert latitude and longitude from degrees to radians
  const φStart = startLat * (Math.PI / 180);
  const φEnd = endLat * (Math.PI / 180);
  const λStart = startLong * (Math.PI / 180);
  const λEnd = endLong * (Math.PI / 180);

  // Calculate the deltas
  const Δλ = λStart - λEnd;
  const Δφ = φStart - φEnd;

  // Calculate the great-circle distance between
  // two points on a sphere given their longitudes and latitudes
  const haversineSquared =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φStart) * Math.cos(φEnd) * Math.sin(Δλ / 2) ** 2;

  // Calculate the central angle
  const centralAngle =
    2 *
    Math.atan2(Math.sqrt(haversineSquared), Math.sqrt(1 - haversineSquared));

  // Calculate the distance
  const distance = centralAngle * R;

  return Number(distance.toFixed(precision));
}
