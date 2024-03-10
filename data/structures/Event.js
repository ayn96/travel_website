import { RecommendationProperties } from "./RecommendationsProperties.js";

export class Event {
  constructor({ name, date, city, recommendation }) {
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
     * @type {RecommendationProperties}
     */
    this.recommendationProperties =
      RecommendationProperties.fromJSON(recommendation);
  }

  setCity(city) {
    this.city = city;
  }

  /**
   * @param {import('../data/CITIES.json')[0]['cities'][0]['events'][0]} event
   */
  static fromJSON(event) {
    return new Event({
      name: event.name,
      date: event.date,
      city: null,
      recommendation: event.recommendation,
    });
  }
}
