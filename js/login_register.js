// @ts-nocheck
import { Credentials } from "../data/login/Credentials.js";

const htmlToInject = await fetch("/components/modals.html");
const response = await htmlToInject.text();
$("#injectModals").html(response);
$(".modal").hide();

$("#regBtn").click(async () => {
  const data = {
    firstName: $("#floatingFName").val(),
    lastName: $("#floatingLName").val(),
    email: $("#floatingInput").val(),
    password: $("#floatingPassword").val(),
    phone: $("#floatingPhone").val(),
    recommendation: {
      price: Number($("#price_range").val()) || 5,
      nature: Number($("#nature_range").val()) || 5,
      nightlife: Number($("#nightlife_range").val()) || 5,
      music: Number($("#music_range").val()) || 5,
      technology: Number($("#technology_range").val()) || 5,
      animals: Number($("#animals_range").val()) || 5,
      fun: Number($("#fun_range").val()) || 5,
      exercise: Number($("#exercise_range").val()) || 5,
      food: Number($("#food_range").val()) || 5,
      couple: Number($("#couple_range").val()) || 5,
      family: Number($("#family_range").val()) || 5,
    },
  };

  console.log(data);

  const credentials = new Credentials(data.email, data.password);
  await credentials.setCredentials(data);
  $("#registerModal").modal("hide");
});

//Based on the login form, send the request to http://
$("#logBtn").click(async () => {
  const data = {
    email: $("#floatingLogInput").val(),
    pass: $("#floatingLogPassword").val(),
  };

  const credentials = new Credentials(data.email, data.pass);
  const cred = await credentials.getCredentials();

  if (cred) {
    alert("Logged in successfully");
    localStorage.setItem("user", JSON.stringify(cred));
  } else {
    alert("Invalid credentials");
  }

  $("#loginModal").modal("hide");
});
