import { Event } from "./Event.js";
import { Hotel } from "./Hotel.js";
import FuzzySearch from "../packages/fuzzy_search/index.js";
import { RecommendationEngine } from "./RecommendationEngine.js";
import { sanitize } from "../utils/sanitizer.js";
import { sortByProperty } from "../utils/sort.js";

export class City {
  constructor({ id, name, hotels, events, features, coordinates, weather }) {
    /**
     * @type {string}
     */
    this.id = id;

    /**
     * @type {string}
     */
    this.name = sanitize(name);
    /**
     * @type {import('./Country.js').Country | null}
     */
    this.country = null;
    /**
     * @type {import('./Hotel.js').Hotel[]}
     */
    this.hotels = hotels;
    /**
     * @type {import('./Event.js').Event[]}
     */
    this.events = events;

    /**
     * @type {import('../data/CITIES.json')[0]['cities'][0]['features']}
     */
    this.features = features;

    /**
     * @type {import('../data/CITIES.json')[0]['cities'][0]['weather']}
     */
    this.weather = weather;

    /**
     * @type {Object}
     * @property {number} lat - The latitude.
     * @property {number} long - The longitude.
     * */
    this.coordinates = coordinates;

    this.addCityToHotels();
    this.addCityToEvents();

    this.hotelFuzzySearch = new FuzzySearch(this.hotels, ["name"], {
      sort: true,
    });

    this.eventFuzzySearch = new FuzzySearch(this.events, ["name"], {
      sort: true,
    });

    this.recommendationEngine = new RecommendationEngine({
      hotels: this.hotels,
      events: this.events,
    });
  }

  setCountry(country) {
    this.country = country;
  }

  addCityToHotels() {
    for (const hotel of this.hotels) {
      hotel.setCity(this);
    }
  }

  addCityToEvents() {
    for (const event of this.events) {
      event.setCity(this);
    }
  }

  /**
   * @param {string} query
   * @returns {import('./Hotel.js').Hotel[]}
   */
  searchHotels(query) {
    return this.hotelFuzzySearch.search(query);
  }

  /**
   * @param {string} query
   * @returns {import('./Event.js').Event[]}
   */
  searchEvents(query) {
    return this.eventFuzzySearch.search(query);
  }

  /**
   * @param {string} sortBy
   * @param {'asc' | 'desc'} order
   * @returns {import('./Hotel.js').Hotel[]}
   */
  getHotels(sortBy = "name", order = "asc") {
    return this.hotels.sort(sortByProperty(sortBy, order));
  }

  /**
   * @param {import('../data/CITIES.json')[0]['cities'][0]} city
   */
  static fromJSON(city) {
    return new City({
      id: city.id,
      name: city.name,
      hotels:
        city.hotels?.map((hotel) => {
          return Hotel.fromJSON(hotel);
        }) ?? [],
      events:
        city.events?.map((event) => {
          return Event.fromJSON(event);
        }) ?? [],
      features: city.features,
      coordinates: {
        lat: city.lat,
        long: city.lon,
      },
      weather: city.weather,
    });
  }
}
