import CITIES from "./data/CITIES.json" assert { type: "json" };
import COUNTRIES from "./data/COUNTRIES.json" assert { type: "json" };
import MOST_VISITED_COUNTRIES from "./data/MOST_VISITED_COUNTRIES.json" assert { type: "json" };
import { City } from "./structures/City.js";
import { Country } from "./structures/Country.js";
import FuzzySearch from "./packages/fuzzy_search/index.js";
import { sortByProperty } from "./utils/sort.js";
import { Flight } from "./structures/Flights.js";
import { createItineraryFactory } from "./utils/itinerary/index.js";

class Storage {
  constructor() {
    const start = performance.now();
    this.mostVisitedCountries = this.buildMostVisitedCountries();

    this.cities = this.buildCities();
    this.countries = this.buildCountries();

    this.flights = {
      fromDeparture: new Map(),
      byId: new Map(),
    };

    this.flightsPromise = new Promise((resolve) => {
      this.buildFlights().then((data) => {
        resolve(data);
        console.log("Flights ready after", performance.now() - start, "ms");
      });
    });

    this.countryFuzzySearch = new FuzzySearch(
      Array.from(this.countries.values()),
      ["name", "code", "region"],
      {
        sort: true,
      }
    );

    this.cityFuzzySearch = new FuzzySearch(
      Array.from(this.cities.values()).flat(),
      ["name"],
      {
        sort: true,
      }
    );

    const allFlights = Array.from(this.flights.fromDeparture.values()).flat();

    this.flightsFuzzySearch = new FuzzySearch(
      allFlights,
      ["id", "airline.name", "departure.city.name", "arrival.city.name"],
      {
        sort: true,
      }
    );

    console.log(
      "Storage initialized in",
      (performance.now() - start).toFixed(3),
      "ms"
    );

    this.createItinerary = createItineraryFactory(this);
  }

  /**
   * @returns {Map<string, typeof MOST_VISITED_COUNTRIES[0] & { country: import('./structures/Country.js').Country | null }>}
   */
  buildMostVisitedCountries() {
    return new Map(
      MOST_VISITED_COUNTRIES.map((country) => {
        return [
          country.cca2,
          {
            ...country,
            country: null,
          },
        ];
      })
    );
  }

  /**
   * @returns {Map<string, import('./structures/City.js').City[]>}
   */
  buildCities() {
    const cityMap = new Map();
    for (const cityGroup of CITIES) {
      if (!cityMap.has(cityGroup.cca2)) {
        cityMap.set(cityGroup.cca2, []);
      }

      for (const city of cityGroup.cities) {
        cityMap.get(cityGroup.cca2).push(City.fromJSON(city));
      }
    }

    return cityMap;
  }

  /**
   * @returns {Map<string, import('./structures/Country.js').Country>}
   */
  buildCountries() {
    const map = new Map();
    for (const country of COUNTRIES) {
      const isMostVisited = this.mostVisitedCountries.get(country.cca2);
      const cities = this.cities.get(country.cca2) ?? [];
      const countryClass = Country.fromJSON(
        country,
        cities,
        Boolean(isMostVisited)
      );

      if (isMostVisited) {
        isMostVisited.country = countryClass;
        this.mostVisitedCountries.set(country.cca2, {
          ...isMostVisited,
          country: countryClass,
        });
      }

      map.set(country.cca2, countryClass);
    }

    for (const [code, country] of this.mostVisitedCountries) {
      if (country.country) {
        map.set(code, country.country);
      }
    }

    return map;
  }

  async buildFlights() {
    const GENERATED_FLIGHTS = await Promise.all(
      Array.from({ length: 50 }).map((_, idx) => {
        return import(`./data/flights/GENERATED_FLIGHTS_${idx}.json`, {
          assert: { type: "json" },
        });
      })
    ).then((flights) => {
      return flights.flatMap((flight) => flight.default);
    });

    const fromDeparture = new Map();
    const fromArrival = new Map();
    const byId = new Map();
    const citiesById = this.getCities().reduce((acc, city) => {
      acc[city.id] = city;
      return acc;
    }, {});

    const allFlights = [];

    for (const flight of GENERATED_FLIGHTS) {
      const flightInstance = Flight.fromJSON(flight);
      allFlights.push(flightInstance);

      const cityDeparture = citiesById[flight.departure.id];
      if (!cityDeparture) {
        throw new Error(`City with id ${flight.departure.id} not found`);
      }

      flightInstance.setDepartureCity(cityDeparture);

      const cityArrival = citiesById[flight.arrival.id];
      if (!cityArrival) {
        throw new Error(`City with id ${flight.arrival.id} not found`);
      }

      flightInstance.setArrivalCity(cityArrival);

      if (
        !flightInstance.arrival.city?.country?.code ||
        !flightInstance.departure.city?.country?.code
      ) {
        continue;
      }

      if (!fromDeparture.has(flightInstance.departure.city?.country.code)) {
        fromDeparture.set(flightInstance.departure.city.country.code, []);
      }

      if (!fromArrival.has(flightInstance.arrival.city.country.code)) {
        fromArrival.set(flightInstance.arrival.city.country.code, []);
      }

      fromDeparture
        .get(flightInstance.departure.city?.country.code)
        .push(flightInstance);
      fromArrival
        .get(flightInstance.arrival.city.country.code)
        .push(flightInstance);
      byId.set(flightInstance.id, flightInstance);
    }

    this.flights = {
      fromDeparture,
      byId,
      fromArrival,
    };

    this.flightsFuzzySearch.haystack = allFlights;

    return this.flights;
  }

  /**
   * @param {string} query
   * @returns {import('./structures/Country.js').Country[]}
   */
  searchCountry(query) {
    return this.countryFuzzySearch.search(query);
  }

  /**
   * @param {string} query
   * @returns {import('./structures/City.js').City[]}
   */
  searchCity(query) {
    return this.cityFuzzySearch.search(query);
  }

  /**
   * @param {string} countryCode
   * @returns {import('./structures/Country.js').Country | null}
   */
  getCountry(countryCode) {
    return this.countries.get(countryCode) ?? null;
  }

  /**
   * @param {string} countryCode
   * @returns {import('./structures/City.js').City[] | null}
   */
  getCitiesByCountry(countryCode) {
    return this.cities.get(countryCode) ?? null;
  }

  /**
   * @returns {import('./structures/City.js').City[]}
   */
  getCities() {
    return Array.from(this.cities.values()).flat();
  }

  /**
   * @returns {import('./structures/Country.js').Country[]}
   */
  getMostVisitedCountries() {
    return Array.from(this.countries.values()).filter(
      (country) => country?.isMostVisited
    );
  }

  /**
   *
   * @param {'name'} sortBy
   * @param {'asc' | 'desc'} order
   * @returns
   */
  getCountries(sortBy = "name", order = "asc") {
    return Array.from(this.countries.values()).sort(
      sortByProperty(sortBy, order)
    );
  }

  /**
   * @param {'name' | 'price' | 'reviewScore'} sortBy
   * @param {'asc' | 'desc'} order
   * @returns {import('./structures/Hotel.js').Hotel[]}
   */
  getHotels(sortBy = "name", order = "asc") {
    return Array.from(this.cities.values())
      .flat()
      .flatMap((city) => city.hotels)
      .sort(sortByProperty(sortBy, order));
  }

  /**
   * @param {'name' | 'price' | 'date'} sortBy
   * @param {'asc' | 'desc'} order
   * @returns {import('./structures/Event.js').Event[]}
   */
  getEvents(sortBy = "name", order = "asc") {
    return Array.from(this.cities.values())
      .flat()
      .flatMap((city) => city.events)
      .sort(sortByProperty(sortBy, order));
  }

  /**
   * @param {string} countryCode
   * @returns {import('./structures/Flights.js').Flight[]}
   */
  getFlightFromDeparture(countryCode, sortBy = "price", order = "asc") {
    console.log("getFlightFromDeparture", countryCode, sortBy, order);
    return (this.flights.fromDeparture.get(countryCode) ?? [])
      .slice(0, 500)
      .sort(sortByProperty(sortBy, order));
  }

  /**
   * @param {string} countryCode
   * @returns {import('./structures/Flights.js').Flight[]}
   */
  getFlightFromArrival(countryCode, sortBy = "price", order = "asc") {
    return (this.flights.fromArrival.get(countryCode) ?? [])
      .slice(0, 500)
      .sort(sortByProperty(sortBy, order));
  }

  /**
   * @param {string} departureCountryCode
   * @param {string} arrivalCountryCode
   * @returns {import('./structures/Flights.js').Flight[]}
   */
  getFlightForDepartureAndArrival(
    departureCountryCode,
    arrivalCountryCode,
    sortBy = "price",
    order = "asc"
  ) {
    return this.flights.fromDeparture
      .get(departureCountryCode)
      .slice(0, 500)
      .filter(
        (flight) => flight.arrival.city?.country?.code === arrivalCountryCode
      )
      .sort(sortByProperty(sortBy, order));
  }

  /**
   * @param {string} query
   * @returns {import('./structures/Flights.js').Flight[]}
   */
  searchFlights(query) {
    return this.flightsFuzzySearch.search(query);
  }

  /**
   * @param {string} id
   * @returns {import('./structures/Flights.js').Flight | null}
   */
  getFlightById(id) {
    return this.flights.byId.get(id) ?? null;
  }

  getCityById(id) {
    return this.getCities().find((city) => city.id === id) ?? null;
  }
}

export const storageInstance = new Storage();
if (typeof window !== "undefined") {
  Reflect.set(window, "dataStorageInstance", storageInstance);
}
