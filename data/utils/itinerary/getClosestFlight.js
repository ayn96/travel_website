import { storageInstance } from "../../Storage.js";

/**
 *
 * @param {string} originCountry
 * @param {string} destinationCountry
 * @param {Date} date
 * @returns
 */
export function getClosestDepartureFlightFromDate(
  originCountry,
  destinationCountry,
  date
) {
  const flights = storageInstance
    .getFlightFromDeparture(originCountry)
    .filter(
      (flight) => flight.arrival.city?.country?.code === destinationCountry
    );

  console.log(flights, originCountry, destinationCountry, date);

  const closestFlight = flights.reduce((prev, curr) => {
    const prevDiff = Math.abs(
      new Date(prev.departure.timestamp).getTime() - date.getTime()
    );
    const currDiff = Math.abs(
      new Date(curr.departure.timestamp).getTime() - date.getTime()
    );
    return prevDiff < currDiff ? prev : curr;
  });

  return closestFlight;
}
