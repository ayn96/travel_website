/**
 *
 * @param {import('../../structures/City.js').City} city
 * @param {Date} startDate
 * @param {Date} endDate
 */
export function getEventsDuringTimeFrame(city, startDate, endDate) {
  console.log(city);
  return city.events.filter(
    (event) =>
      event.date.getTime() >= startDate.getTime() &&
      event.date.getTime() <= endDate.getTime()
  );
}
