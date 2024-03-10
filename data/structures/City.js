import { Event } from "./Event.js";
import { Hotel } from "./Hotel.js";

export class City {
  constructor({ name, hotels, events }) {
    /**
     * @type {string}
     */
    this.name = name;
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
