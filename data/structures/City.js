import { Event } from "./Event.js";
import { Hotel } from "./Hotel.js";
import FuzzySearch from "../packages/fuzzy_search/index.js";
import { RecommendationEngine } from "./RecommendationEngine.js";
import { sanitize } from "../utils/sanitizer.js";

export class City {
  constructor({ name, hotels, events }) {
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
   * @param {import('../data/CITIES.json')[0]['cities'][0]} city
   */
  static fromJSON(city) {
    return new City({
      name: city.name,
      hotels:
        city.hotels?.map((hotel) => {
          return Hotel.fromJSON(hotel);
        }) ?? [],
      events:
        city.events?.map((event) => {
          return Event.fromJSON(event);
        }) ?? [],
    });
  }
}
