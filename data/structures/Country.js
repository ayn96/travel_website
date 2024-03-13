import FuzzySearch from "../packages/fuzzy_search/index.js";
import { sanitize } from "../utils/sanitizer.js";

export class Country {
  constructor({
    name,
    code,
    currency: {
      name: currencyName,
      code: currencyCode,
      symbol: currencySymbol,
    },
    flag: { url: flag, alt: flagAlt },
    region,
    languages,
    cord: { lat, long },
    population,
    timezones,
    continents,
    cities,
    isMostVisited,
  }) {
    /**
     * @type {string}
     */
    this.name = sanitize(name);
    /**
     * @type {string}
     */
    this.code = code;
    /**
     * @type {Object}
     * @property {string} name - The name of the currency.
     * @property {string} code - The code of the currency.
     * @property {string} symbol - The symbol of the currency.
     */
    this.currency = {
      name: sanitize(currencyName),
      code: currencyCode,
      symbol: currencySymbol,
    };
    /**
     * @type {Object}
     * @property {string} url - The URL of the flag.
     * @property {string} alt - The alternative text for the flag.
     */
    this.flag = {
      url: flag,
      alt: flagAlt,
    };
    /**
     * @type {string}
     */
    this.region = sanitize(region);
    /**
     * @type {Record<string, string>}
     */
    this.languages = languages;
    /**
     * @type {Object}
     * @property {number} lat - The latitude.
     * @property {number} long - The longitude.
     */
    this.cord = {
      lat,
      long,
    };
    /**
     * @type {number}
     */
    this.population = population;
    /**
     * @type {Array<string>}
     */
    this.timezones = timezones?.map(sanitize) || [];
    /**
     * @type {Array<string>}
     */
    this.continents = continents?.map(sanitize) || [];
    /**
     * @type {import('./City.js').City[]}
     */
    this.cities = cities;
    /**
     * @type {boolean}
     */
    this.isMostVisited = isMostVisited || false;

    this.addCountryToCities();

    this.cityFuzzySearch = new FuzzySearch(this.cities, ["name"], {
      sort: true,
    });
  }

  addCountryToCities() {
    for (const city of this.cities) {
      city.setCountry(this);
    }
  }

  /**
   * @param {string} query
   * @returns {import('./City.js').City[]}
   */
  searchCities(query) {
    return this.cityFuzzySearch.search(query);
  }

  /**
   *
   * @param {import('../data/COUNTRIES.json')[0]} json
   * @param {import('./City.js').City[]} cities
   * @param {boolean} isMostVisited
   * @returns {Country}
   */
  static fromJSON(json, cities, isMostVisited) {
    const primaryCurrencyName = json.currencies
      ? Object.keys(json.currencies)[0]
      : null;

    return new Country({
      name: json.name.official,
      code: json.cca2,
      currency: {
        name: primaryCurrencyName || "Unknown",
        code:
          json.currencies && primaryCurrencyName
            ? json.currencies[primaryCurrencyName].code
            : "Unk",
        symbol:
          json.currencies && primaryCurrencyName
            ? json.currencies[primaryCurrencyName].symbol
            : "???",
      },
      flag: {
        url: json.flags.png,
        alt: json.flags.alt,
      },
      region: json.region,
      languages: json.languages,
      cord: {
        lat: json.latlng[0],
        long: json.latlng[1],
      },
      population: json.population,
      timezones: json.timezones,
      continents: json.continents,
      cities: cities,
      isMostVisited,
    });
  }
}
