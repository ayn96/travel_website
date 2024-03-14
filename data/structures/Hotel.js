import { RecommendationProperties } from "./RecommendationsProperties.js";

export class Hotel {
  constructor({
    name,
    price,
    recommendation,
    stars,
    review_score,
    lat,
    lon,
    rooms: { single, double, deluxe },
    features,
  }) {
    /**
     * @type {string}
     */
    this.name = name;

    /**
     * @type {number}
     */
    this.price = price;

    /**
     * @type {RecommendationProperties}
     */
    this.recommendationProperties =
      RecommendationProperties.fromJSON(recommendation);

    /**
     * @type {number}
     */
    this.stars = stars;

    /**
     * @type {number}
     */
    this.reviewScore = review_score;

    /**
     * @type {Object}
     * @property {number} lat - The latitude.
     * @property {number} long - The longitude.
     */
    this.cord = {
      lat,
      long: lon,
    };

    /**
     * @type {Object}
     * @property {number} single
     * @property {number} double
     * @property {number} deluxe
     */
    this.rooms = {
      single,
      double,
      deluxe,
    };

    /**
     * @type {string[]}
     */
    this.features = features;
  }

  setCity(city) {
    this.city = city;
  }

  /**
   * @param {import('../data/CITIES.json')[0]['cities'][0]['hotels'][0]} hotel
   */
  static fromJSON(hotel) {
    return new Hotel(hotel);
  }

  toJSON() {
    return {
      city: this.city?.id,
      name: this.name,
      price: this.price,
      recommendation: this.recommendationProperties.toJSON(),
      stars: this.stars,
      review_score: this.reviewScore,
      lat: this.cord.lat,
      lon: this.cord.long,
      rooms: this.rooms,
      features: this.features,
    };
  }
}
