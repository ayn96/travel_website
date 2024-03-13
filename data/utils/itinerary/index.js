import { storageInstance } from "../../Storage.js";
import { RecommendationProperties } from "../../structures/RecommendationsProperties.js";
import { sortByProperty } from "../sort.js";
import { getClosestDepartureFlightFromDate } from "./getClosestFlight.js";
import { getEventsDuringTimeFrame } from "./getEventsDuringTimeFrame.js";

/**
 *
 * @param {{ originCountry: string, destinationCountry: string, days: number, departureDate: string }} param0
 */
export async function createItinerary({
  originCountry,
  destinationCountry,
  days,
  departureDate,
}) {
  await storageInstance.flightsPromise;
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

  const recommendedEvents = getEventsDuringTimeFrame(
    closestDepartureFlight.arrival.city,
    new Date(departureDate),
    roundTripDate
  );

  let hotels = closestDepartureFlight.arrival.city.hotels.sort(
    sortByProperty("reviewScore", "desc")
  );

  if (typeof window !== "undefined" && localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRecommendations = new RecommendationProperties(
      user.recommendation
    );
    hotels =
      closestDepartureFlight.arrival.city?.recommendationEngine?.recommendHotels(
        userRecommendations
      ) ?? hotels;
  }

  const hotelPrice = hotels[0].price;

  const totalPrice =
    hotelPrice * days +
    closestDepartureFlight.price +
    closestRoundTripFlight.price;

  return {
    recommendedHotels: hotels,
    totalPrice,
    closestDepartureFlight,
    closestRoundTripFlight,
    recommendedEvents,
  };
}

console.log(
  await createItinerary({
    originCountry: "US",
    destinationCountry: "FR",
    days: 7,
    departureDate: new Date().toISOString(),
  })
);
