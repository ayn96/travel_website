import { storageInstance } from "../Storage.js";
import { calculateDistanceBetweenCoordinates } from "../utils/distanceBetweenCoodinates.js";
import flights from "../data/flights/GRU.json" assert { type: "json" };
import { writeFileSync } from "fs";
import { URL } from "url";

const citiesWithAirports = Array.from(storageInstance.cities.values())
  .flat()
  .filter((city) => city.features.is_international_airport);

const getRandomCity = () => {
  return citiesWithAirports[
    Math.floor(Math.random() * citiesWithAirports.length)
  ];
};

const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 30));
  return date;
};

const getRandomPrice = () => {
  return Math.floor(Math.random() * 1000);
};

const getRandomPlanePicture = () => {
  return flights[0].aircraftImages[
    Math.floor(Math.random() * flights[0].aircraftImages.length)
  ].images.medium[0];
};

const getRandomAirline = () => {
  const a = {
    AC: {
      name: "Air Canada",
      code: {
        iata: "AC",
        icao: "ACA",
      },
    },
    AD: {
      name: "Azul Linhas Aereas",
      code: {
        iata: "AD",
        icao: "AZU",
      },
    },
    AF: {
      name: "Air France",
      code: {
        iata: "AF",
        icao: "AFR",
      },
    },
    AI: {
      name: "Air India",
      code: {
        iata: "AI",
        icao: "AIC",
      },
    },
    AM: {
      name: "Aeromexico",
      code: {
        iata: "AM",
        icao: "AMX",
      },
    },
    AR: {
      name: "Aerolineas Argentinas",
      code: {
        iata: "AR",
        icao: "ARG",
      },
    },
    AV: {
      name: "Avianca",
      code: {
        iata: "AV",
        icao: "AVA",
      },
    },
    AY: {
      name: "Finnair",
      code: {
        iata: "AY",
        icao: "FIN",
      },
    },
    CA: {
      name: "Air China",
      code: {
        iata: "CA",
        icao: "CCA",
      },
    },
    CM: {
      name: "Copa Airlines",
      code: {
        iata: "CM",
        icao: "CMP",
      },
    },
    CX: {
      name: "Cathay Pacific",
      code: {
        iata: "CX",
        icao: "CPA",
      },
    },
    DL: {
      name: "Delta Air Lines",
      code: {
        iata: "DL",
        icao: "DAL",
      },
    },
    EK: {
      name: "Emirates",
      code: {
        iata: "EK",
        icao: "UAE",
      },
    },
    ET: {
      name: "Ethiopian Airlines",
      code: {
        iata: "ET",
        icao: "ETH",
      },
    },
    EY: {
      name: "Etihad Airways",
      code: {
        iata: "EY",
        icao: "ETD",
      },
    },
    G3: {
      name: "GOL Linhas Aereas",
      code: {
        iata: "G3",
        icao: "GLO",
      },
    },
    IB: {
      name: "Iberia",
      code: {
        iata: "IB",
        icao: "IBE",
      },
    },
    JL: {
      name: "Japan Airlines",
      code: {
        iata: "JL",
        icao: "JAL",
      },
    },
    KL: {
      name: "KLM",
      code: {
        iata: "KL",
        icao: "KLM",
      },
    },
    KQ: {
      name: "Kenya Airways",
      code: {
        iata: "KQ",
        icao: "KQA",
      },
    },
    LA: {
      name: "LATAM Airlines",
      code: {
        iata: "LA",
        icao: "LAN",
      },
    },
    LX: {
      name: "Swiss",
      code: {
        iata: "LX",
        icao: "SWR",
      },
    },
    MF: {
      name: "Xiamen Air",
      code: {
        iata: "MF",
        icao: "CXA",
      },
    },
    NH: {
      name: "All Nippon Airways",
      code: {
        iata: "NH",
        icao: "ANA",
      },
    },
    QF: {
      name: "Qantas",
      code: {
        iata: "QF",
        icao: "QFA",
      },
    },
    QR: {
      name: "Qatar Airways",
      code: {
        iata: "QR",
        icao: "QTR",
      },
    },
    SQ: {
      name: "Singapore Airlines",
      code: {
        iata: "SQ",
        icao: "SIA",
      },
    },
    TK: {
      name: "Turkish Airlines",
      code: {
        iata: "TK",
        icao: "THY",
      },
    },
    TP: {
      name: "TAP Air Portugal",
      code: {
        iata: "TP",
        icao: "TAP",
      },
    },
    UA: {
      name: "United Airlines",
      code: {
        iata: "UA",
        icao: "UAL",
      },
    },
    UL: {
      name: "SriLankan Airlines",
      code: {
        iata: "UL",
        icao: "ALK",
      },
    },
    UX: {
      name: "Air Europa",
      code: {
        iata: "UX",
        icao: "AEA",
      },
    },
  };

  const keys = Object.keys(a);
  return a[keys[(keys.length * Math.random()) << 0]];
};

const getArrivalTime = (start, distance) => {
  const time = distance / 800 / 1000;
  const date = new Date(start);
  date.setHours(date.getHours() + time);
  return date;
};

const getRandomFlight = () => {
  const randomCityFrom = getRandomCity();
  const randomCityTo = getRandomCity();
  if (randomCityFrom === randomCityTo) {
    return getRandomFlight();
  }

  const distance = calculateDistanceBetweenCoordinates(
    {
      lat: randomCityFrom.coordinates.lat,
      long: randomCityFrom.coordinates.long,
    },
    {
      lat: randomCityTo.coordinates.lat,
      long: randomCityTo.coordinates.long,
    }
  );

  const date = getRandomDate();
  const arrival = getArrivalTime(date, distance);

  return {
    airline: getRandomAirline(),
    airplane: getRandomPlanePicture(),
    departure: {
      id: randomCityFrom.id,
      name: randomCityFrom.name,
      airport: randomCityFrom.features.airport,
      timestamp: date,
    },
    arrival: {
      id: randomCityTo.id,
      name: randomCityTo.name,
      airport: randomCityTo.features.airport,
      timestamp: arrival,
    },
    price: distance / 1000 + getRandomPrice(),
    distance: distance / 1000,
    time: distance / 800 / 1000,
  };
};

console.log(
  "Creating flights...",
  Array.from({ length: 100 }, getRandomFlight)
);

const url = new URL("../data/flights/GENERATED_FLIGHTS.json", import.meta.url);

writeFileSync(
  url,
  JSON.stringify(
    Array.from({ length: 3000 }, getRandomFlight),

    null,
    2
  )
);
