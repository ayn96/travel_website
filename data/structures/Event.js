import { RecommendationProperties } from "./RecommendationsProperties.js";

export class Event {
  constructor({ name, code, date, city, recommendation }) {
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {string}
     */
    this.code = code;
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

  static fromJSON(data) {
    return new Event(data);
  }
}
