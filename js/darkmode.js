// dark mode with Jquery
const darkMode = () => {
  let darkModeEnabled = localStorage.getItem("darkModeEnabled") == "true"; //true = darkmode on

  if (darkModeEnabled) {
    document.documentElement.setAttribute("data-theme", "dark");
    $(".mode_switch").text("Light Mode");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    $(".mode_switch").text("Dark Mode");
  }

  $(".mode_switch").click(() => {
    darkModeEnabled = !darkModeEnabled; //toggle

    if (darkModeEnabled) {
      document.documentElement.setAttribute("data-theme", "dark");
      $(".mode_switch").text("Light Mode");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      $(".mode_switch").text("Dark Mode");
    }

    localStorage.setItem("darkModeEnabled", darkModeEnabled);
  });
};

darkMode();
