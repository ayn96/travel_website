import { writeFileSync } from "fs";

function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const addIdToFlight = (flight) => {
  flight.id = createUUID();
  return flight;
};

for (const [idx] of Array.from({ length: 50 }).entries()) {
  const url = new URL(
    `../data/flights/GENERATED_FLIGHTS_${idx}.json`,
    import.meta.url
  );

  const flights = await import(url.href, {
    assert: {
      type: "json",
    },
  }).then((a) => a.default);
  const path = url;

  writeFileSync(path, JSON.stringify(flights.map(addIdToFlight), null, 2));
  console.log(`File ${path} created`);
}
