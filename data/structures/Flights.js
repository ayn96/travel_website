export class Flight {
  constructor({
    airline,
    airplane,
    departure,
    arrival,
    price,
    distance,
    time,
  }) {
    /**
     * @type {{ name: string, code: { iata: string, icao: string } }}
     */
    this.airline = airline;

    /**
     * @type {{ src: string, link: string, copyrigth: string, source: string }}
     */
    this.airplane = airplane;

    this.departure = {
      id: departure.id,
      /**
       * @type {import('./City.js').City | null}
       */
      city: null,
      name: departure.name,
      airport: departure.airport,
      timestamp: new Date(departure.timestamp),
    };

    this.arrival = {
      id: arrival.id,
      /**
       * @type {import('./City.js').City | null}
       */
      city: null,
      name: arrival.name,
      airport: arrival.airport,
      timestamp: new Date(arrival.timestamp),
    };

    this.price = price;
    this.distanceInKm = distance;
    this.timeInHour = time;
  }

  /**
   * @param {import('./City.js').City} city
   */
  setDepartureCity(city) {
    this.departure.city = city;
  }

  /**
   * @param {import('./City.js').City} city
   */
  setArrivalCity(city) {
    this.arrival.city = city;
  }

  calculateRoundTrip() {
    return {
      price: this.price * 2,
      distance: this.distanceInKm * 2,
      time: this.timeInHour * 2,
    };
  }

  /**
   * @param {import('../data/flights/GENERATED_FLIGHTS.json')[0]} json
   */
  static fromJSON(json) {
    return new Flight({
      airline: json.airline,
      airplane: json.airplane,
      departure: json.departure,
      arrival: json.arrival,
      price: json.price,
      distance: json.distance,
      time: json.time,
    });
  }
}

export default Flight;
