export function sortByProperty(prop, order = "asc") {
  return (a, b) => {
    if (order === "asc") {
      return a[prop] < b[prop] ? -1 : 1;
    } else {
      return a[prop] < b[prop] ? 1 : -1;
    }
  };
}
