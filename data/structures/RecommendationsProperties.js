export class RecommendationProperties {
  /**
   * @param {{price: number;nature: number;nightlife: number;music: number;technology: number;animals: number;fun: number;exercise: number;food: number;couple: number;family: number}} data
   */
  constructor(data) {
    /**
     * @type {number}
     */
    this.price = data.price || 0;
    /**
     * @type {number}
     */
    this.nature = data.nature || 0;
    /**
     * @type {number}
     */
    this.nightlife = data.nightlife || 0;
    /**
     * @type {number}
     */
    this.music = data.music || 0;
    /**
     * @type {number}
     */
    this.technology = data.technology || 0;
    /**
     * @type {number}
     */
    this.animals = data.animals || 0;
    /**
     * @type {number}
     */
    this.fun = data.fun || 0;
    /**
     * @type {number}
     */
    this.exercise = data.exercise || 0;
    /**
     * @type {number}
     */
    this.food = data.food || 0;
    /**
     * @type {number}
     */
    this.couple = data.couple || 0;
    /**
     * @type {number}
     */
    this.family = data.family || 0;
  }

  toJSON() {
    return {
      price: this.price,
      nature: this.nature,
      nightlife: this.nightlife,
      music: this.music,
      technology: this.technology,
      animals: this.animals,
      fun: this.fun,
      exercise: this.exercise,
      food: this.food,
      couple: this.couple,
      family: this.family,
    };
  }

  /**
   * @param {{price: number;nature: number;nightlife: number;music: number;technology: number;animals: number;fun: number;exercise: number;food: number;couple: number;family: number}} data
   * @returns
   */
  static fromJSON(data) {
    return new RecommendationProperties(data);
  }
}
