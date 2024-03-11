export function validateCoordinates(cord, name) {
  if (typeof cord !== "object" || cord === null) {
    throw new TypeError(`Invalid ${name}`);
  }
  const { lat, long } = cord;
  validateNumber(lat, `${name}.latitude`);
  validateNumber(long, `${name}.longitude`);

  if (lat < -90 || lat > 90 || long < -180 || long > 180) {
    throw new RangeError(`Invalid ${name} coordinates, out of range`);
  }
}

function validateNumber(value, name) {
  if (typeof value !== "number" || isNaN(value)) {
    throw new TypeError(`Invalid ${name}`);
  }

  if (!Number.isFinite(value)) {
    throw new RangeError(`Invalid ${name}`);
  }
}
