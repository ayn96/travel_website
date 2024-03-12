import { RecommendationProperties } from "./RecommendationsProperties.js";

export class RecommendationEngine {
  constructor({ hotels, events }) {
    /**
     * @type {import('./Hotel.js').Hotel[]}
     */
    this.hotels = hotels;
    /**
     * @type {import('./Event.js').Event[]}
     */
    this.events = events;
  }

  /**
   * @param {RecommendationProperties} userRecommendations
   * @returns {import('./Hotel.js').Hotel[]}
   */
  recommendHotels(userRecommendations) {
    const sortedHotels = this.hotels.sort((a, b) => {
      const aScore = this.calculateScore(
        userRecommendations,
        a.recommendationProperties
      );
      const bScore = this.calculateScore(
        userRecommendations,
        b.recommendationProperties
      );
      return bScore - aScore;
    });

    return sortedHotels;
  }

  /**
   * @param {RecommendationProperties} userRecommendations
   * @returns {import('./Event.js').Event[]}
   */
  recommendEvents(userRecommendations) {
    const sortedEvents = this.events.sort((a, b) => {
      const aScore = this.calculateScore(
        userRecommendations,
        a.recommendationProperties
      );
      const bScore = this.calculateScore(
        userRecommendations,
        b.recommendationProperties
      );
      return bScore - aScore;
    });

    return sortedEvents;
  }

  /**
   * @param {RecommendationProperties} recommendations
   * @param {RecommendationProperties} userRecommendations
   */
  calculateScore(recommendations, userRecommendations) {
    let score = 0;
    for (const recommendation in recommendations) {
      const multiplier = userRecommendations[recommendation];
      score += recommendations[recommendation] * multiplier;
    }
    const normalizedScore = score / (Object.keys(recommendations).length * 10);
    return normalizedScore;
  }
}
