import CITIES from "./data/CITIES.json" assert { type: "json" };
import COUNTRIES from "./data/COUNTRIES.json" assert { type: "json" };
import MOST_VISITED_COUNTRIES from "./data/MOST_VISITED_COUNTRIES.json" assert { type: "json" };
import { City } from "./structures/City.js";
import { Country } from "./structures/Country.js";
import FuzzySearch from "./packages/fuzzy_search/index.js";
import { inspect } from "util";
inspect.defaultOptions.depth = null;

export class Storage {
  constructor() {
    this.mostVisitedCountries = this.buildMostVisitedCountries();

    this.cities = this.buildCities();
    this.countries = this.buildCountries();

    this.countryFuzzySearch = new FuzzySearch(this.countries, [
      "name",
      "code",
      "region",
    ]);

    this.cityFuzzySearch = new FuzzySearch(
      Array.from(this.cities.values()).flat(),
      ["name"]
    );
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
   * @returns {Map<string, import('./structures/City.js').City[]>}
   */
  buildCities() {
    const cityMap = new Map();
    for (const cityGroup of CITIES) {
      if (!cityMap.has(cityGroup.cca2)) {
        cityMap.set(cityGroup.cca2, []);
      }

      for (const city of cityGroup.cities) {
        cityMap.get(cityGroup.cca2).push(City.fromJSON(city));
      }
    }

    return cityMap;
  }

  /**
   * @returns {import('./structures/Country.js').Country[]}
   */
  buildCountries() {
    return COUNTRIES.map((country) => {
      const isMostVisited = this.mostVisitedCountries.get(country.cca2);
      const cities = this.cities.get(country.cca2) ?? [];
      const countryClass = Country.fromJSON(
        country,
        cities,
        Boolean(isMostVisited)
      );

      if (isMostVisited) {
        isMostVisited.country = countryClass;
      }

      return countryClass;
    });
  }

  /**
   * @param {string} query
   * @returns {import('./structures/Country.js').Country[]}
   */
  searchCountry(query) {
    return this.countryFuzzySearch.search(query);
  }

  /**
   * @param {string} query
   * @returns {import('./structures/City.js').City[]}
   */
  searchCity(query) {
    return this.cityFuzzySearch.search(query);
  }
}

new Storage();
