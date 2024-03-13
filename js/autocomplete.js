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
      return;
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
    div.append(
      $(`<div>${result.name}</div>`)
        .addClass("autocomplete__list-item")
        .click(() => {
          e.target.value = result.name;
          div.hide();
        })
    );
  }
});

$("[auto-complete-for]").hide();
