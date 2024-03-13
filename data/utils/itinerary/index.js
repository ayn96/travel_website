import { storageInstance } from "../../Storage.js";
import { getClosestDepartureFlightFromDate } from "./getClosestFlight.js";

/**
 *
 * @param {{ originCountry: string, destinationCountry: string, budget: number, days: number, departureDate: string }} param0
 */
export function createItinerary({
  originCountry,
  destinationCountry,
  budget,
  days,
  departureDate,
}) {
  const closestDepartureFlight = getClosestDepartureFlightFromDate(
    originCountry,
    destinationCountry,
    new Date(departureDate)
  );

  const roundTripDate = new Date(departureDate);
  roundTripDate.setDate(roundTripDate.getDate() + days);
  console.log(roundTripDate);

  const closestRoundTripFlight = getClosestDepartureFlightFromDate(
    destinationCountry,
    originCountry,
    roundTripDate
  );

  return {
    originCountry,
    destinationCountry,
    budget,
    days,
    departureDate,
    roundTripDate,
    closestDepartureFlight,
    closestRoundTripFlight,
  };
}

console.log(
  createItinerary({
    originCountry: "US",
    destinationCountry: "FR",
    budget: 1000,
    days: 7,
    departureDate: new Date().toISOString(),
  })
);
