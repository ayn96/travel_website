$("[auto-complete]").keyup((e) => {
  const div = $(`[auto-complete-for=${e.target.id}]`);

  if (e.target.value.length < 2) {
    div.hide();
    return;
  }

  const attValue = e.target.getAttribute("auto-complete");
  const storageInstance = window.dataStorageInstance;

  let searchFunction;
  switch (attValue) {
    case "flight":
      searchFunction = storageInstance.searchFlights.bind(storageInstance);
      break;
    case "country":
      searchFunction = storageInstance.searchCountry.bind(storageInstance);
      break;
    case "city":
      searchFunction = storageInstance.searchCity.bind(storageInstance);
      break;
    default:
      throw new Error("Invalid auto-complete attribute value");
  }

  const results = searchFunction(e.target.value);
  div.empty();
  div.show();

  if (!results.length) {
    div.append(
      $("<div>No results found</div>").addClass(
        "autocomplete__list-item--disabled"
      )
    );
    return;
  }

  for (const result of results.slice(0, 5)) {
    const item = $(`<div>${result.name}</div>`).addClass(
      "autocomplete__list-item"
    );

    if (result.constructor.name === "Country" && !result.isMostVisited) {
      item.addClass("autocomplete__list-item--disabled");
    } else {
      item.click(() => {
        e.target.value = result.name;
        div.hide();
      });
    }

    div.append(item);
  }
});

$("[auto-complete-for]").hide();
