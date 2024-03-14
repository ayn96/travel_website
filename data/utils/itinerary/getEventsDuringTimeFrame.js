/**
 *
 * @param {import('../../structures/City.js').City} city
 * @param {Date} startDate
 * @param {Date} endDate
 */
export function getEventsDuringTimeFrame(city, startDate, endDate) {
  console.log(startDate, endDate);
  console.log(city);
  return city.events.filter((event) => {
    console.log({
      isBefore: event.date.getTime() >= startDate.getTime(),
      isAfter: event.date.getTime() <= endDate.getTime(),
      eventDate: event.date,
    });

    return (
      event.date.getTime() >= startDate.getTime() &&
      event.date.getTime() <= endDate.getTime()
    );
  });
}
