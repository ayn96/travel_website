import { RecommendationProperties } from "./RecommendationsProperties.js";

export class Event {
  constructor({ name, date, city, price, recommendation }) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {Date}
     */
    this.date = new Date(date);
    /**
     * @type {import('./City.js').City | null}
     */
    this.city = city;

    /**
     * @type {number}
     */
    this.price = price;

    /**
     * @type {RecommendationProperties}
     */
    this.recommendationProperties =
      RecommendationProperties.fromJSON(recommendation);
  }

  setCity(city) {
    this.city = city;
  }

  toJSON() {
    return {
      name: this.name,
      date: this.date.toISOString(),
      city: this.city?.id,
      price: this.price,
      recommendation: this.recommendationProperties.toJSON(),
    };
  }

  /**
   * @param {import('../data/CITIES.json')[0]['cities'][0]['events'][0]} event
   */
  static fromJSON(event) {
    return new Event({
      name: event.name,
      date: event.date,
      price: event.price,
      city: null,
      recommendation: event.recommendation,
    });
  }
}
