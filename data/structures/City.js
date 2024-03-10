export class City {
  constructor({ name, code, hotels, events }) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {string}
     */
    this.code = code;
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
}
