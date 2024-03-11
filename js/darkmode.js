// dark mode with Jquery
$(document).ready(function() {
  const darkMode = () => {
    let darkModeEnabled = localStorage.getItem("darkModeEnabled") == "true";  //true = darkmode on

    if (darkModeEnabled) {
      $("body").addClass("dark-mode");
      $(".mode_switch").text("Light Mode"); 
    } else {
      $("body").removeClass("dark-mode"); 
      $(".mode_switch").text("Dark Mode"); 
    }

    $(".mode_switch").click(() => {
      darkModeEnabled = !darkModeEnabled; //toggle

      if (darkModeEnabled) {
        $("body").addClass("dark-mode");
        $(".mode_switch").text("Light Mode"); 
      } else {
        $("body").removeClass("dark-mode"); 
        $(".mode_switch").text("Dark Mode"); 
      }

      localStorage.setItem('darkModeEnabled', darkModeEnabled);
    });
  };

  darkMode();
});
