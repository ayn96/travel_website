import CITIES from "./data/CITIES.json";
import COUNTRIES from "./data/COUNTRIES.json";
import MOST_VISITED_COUNTRIES from "./data/MOST_VISITED_COUNTRIES.json";
import { City } from "./structures/City.js";
import { Country } from "./structures/Country.js";

export class Storage {
  constructor() {
    this.mostVisitedCountries = this.buildMostVisitedCountries();

    this.cities = this.buildCities();
    this.countries = this.buildCountries();
  }

  /**
   * @returns {Map<string, typeof MOST_VISITED_COUNTRIES[0] & { country: import('./structures/Country.js').Country | null }>}
   */
  buildMostVisitedCountries() {
    return new Map(
      MOST_VISITED_COUNTRIES.map((country) => {
        return [
          country.cca2,
          {
            ...country,
            country: null,
          },
        ];
      })
    );
  }

  /**
   * @returns {import('./structures/City.js').City[]}
   */
  buildCities() {
    return CITIES.map((city) => {
      return City.fromJSON(city);
    });
  }

  /**
   * @returns {import('./structures/Country.js').Country[]}
   */
  buildCountries() {
    return COUNTRIES.map((country) => {
      const isMostVisited = this.mostVisitedCountries.get(country.cca2);
      const countryClass = Country.fromJSON(
        country,
        this.cities,
        Boolean(isMostVisited)
      );

      if (isMostVisited) {
        isMostVisited.country = countryClass;
      }

      return countryClass;
    });
  }
}
