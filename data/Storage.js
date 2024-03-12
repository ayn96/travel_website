import CITIES from "./data/CITIES.json" assert { type: "json" };
import COUNTRIES from "./data/COUNTRIES.json" assert { type: "json" };
import MOST_VISITED_COUNTRIES from "./data/MOST_VISITED_COUNTRIES.json" assert { type: "json" };
import { City } from "./structures/City.js";
import { Country } from "./structures/Country.js";
import FuzzySearch from "./packages/fuzzy_search/index.js";

class Storage {
  constructor() {
    this.mostVisitedCountries = this.buildMostVisitedCountries();

    this.cities = this.buildCities();
    this.countries = this.buildCountries();

    this.countryFuzzySearch = new FuzzySearch(
      Array.from(this.countries.values()),
      ["name", "code", "region"],
      {
        sort: true,
      }
    );

    this.cityFuzzySearch = new FuzzySearch(
      Array.from(this.cities.values()).flat(),
      ["name"],
      {
        sort: true,
      }
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
   * @returns {Map<string, import('./structures/Country.js').Country>}
   */
  buildCountries() {
    const map = new Map();
    for (const country of COUNTRIES) {
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

      map.set(country.cca2, countryClass);
    }

    return map;
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

  /**
   * @param {string} countryCode
   * @returns {import('./structures/Country.js').Country | null}
   */
  getCountry(countryCode) {
    return this.countries.get(countryCode) ?? null;
  }

  /**
   * @param {string} countryCode
   * @returns {import('./structures/City.js').City[] | null}
   */
  getCitiesByCountry(countryCode) {
    return this.cities.get(countryCode) ?? null;
  }

  /**
   * @returns {import('./structures/Country.js').Country[]}
   */
  getMostVisitedCountries() {
    return Array.from(this.countries.values()).filter(
      (country) => country?.isMostVisited
    );
  }

  /**
   * @returns {import('./structures/Hotel.js').Hotel[]}
   */
  getHotels() {
    return Array.from(this.cities.values())
      .flat()
      .flatMap((city) => city.hotels);
  }
}

export const storageInstance = new Storage();
