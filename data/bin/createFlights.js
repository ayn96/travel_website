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
  const data =
    { src: "https://cdn.jetphotos.com/400/5/783097_1707950443.jpg?v=0" } ||
    flights[0].aircraftImages[
      Math.floor(Math.random() * flights[0].aircraftImages.length)
    ].images.medium[0];

  return {
    src: data.src,
  };
};

const getRandomAirline = () => {
  const a = {
    AC: {
      name: "Air Canada",
      code: "ACA",
    },
    AD: {
      name: "Azul Linhas Aereas",
      code: "AZU",
    },
    AF: {
      name: "Air France",
      code: "AFR",
    },
    AI: {
      name: "Air India",
      code: "AIC",
    },
    AM: {
      name: "Aeromexico",
      code: "AMX",
    },
    AR: {
      name: "Aerolineas Argentinas",
      code: "ARG",
    },
    AV: {
      name: "Avianca",
      code: "AVA",
    },
    AY: {
      name: "Finnair",
      code: "FIN",
    },
    CA: {
      name: "Air China",
      code: "CCA",
    },
    CM: {
      name: "Copa Airlines",
      code: "CMP",
    },
    CX: {
      name: "Cathay Pacific",
      code: "CPA",
    },
    DL: {
      name: "Delta Air Lines",
      code: "DAL",
    },
    EK: {
      name: "Emirates",
      code: "UAE",
    },
    ET: {
      name: "Ethiopian Airlines",
      code: "ETH",
    },
    EY: {
      name: "Etihad Airways",
      code: "ETD",
    },
    G3: {
      name: "GOL Linhas Aereas",
      code: "GLO",
    },
    IB: {
      name: "Iberia",
      code: "IBE",
    },
    JL: {
      name: "Japan Airlines",
      code: "JAL",
    },
    KL: {
      name: "KLM",
      code: "KLM",
    },
    KQ: {
      name: "Kenya Airways",
      code: "KQA",
    },
    LA: {
      name: "LATAM Airlines",
      code: "LAN",
    },
    LX: {
      name: "Swiss",
      code: "SWR",
    },
    MF: {
      name: "Xiamen Air",
      code: "CXA",
    },
    NH: {
      name: "All Nippon Airways",
      code: "ANA",
    },
    QF: {
      name: "Qantas",
      code: "QFA",
    },
    QR: {
      name: "Qatar Airways",
      code: "QTR",
    },
    SQ: {
      name: "Singapore Airlines",
      code: "SIA",
    },
    TK: {
      name: "Turkish Airlines",
      code: "THY",
    },
    TP: {
      name: "TAP Air Portugal",
      code: "TAP",
    },
    UA: {
      name: "United Airlines",
      code: "UAL",
    },
    UL: {
      name: "SriLankan Airlines",
      code: "ALK",
    },
    UX: {
      name: "Air Europa",
      code: "AEA",
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
      airport: randomCityTo.features.airport,
      timestamp: arrival,
    },
    price: distance / 1000 + getRandomPrice(),
    distance: distance / 1000,
    time: distance / 800 / 1000,
  };
};

console.log("Creating flights...");

for (const [idx] of Array.from({ length: 50 }).entries()) {
  const url = new URL(
    `../data/flights/GENERATED_FLIGHTS_${idx}.json`,
    import.meta.url
  );
  writeFileSync(
    url,
    JSON.stringify(Array.from({ length: 1000 }).map(getRandomFlight))
  );
}

console.log("Flights created successfully");
