var flightType = document.getElementById("flightType");
var startDt = document.getElementById("startDt");
var endDt = document.getElementById("endDt");

var origin = document.getElementById("origin");
var destiny = document.getElementById("destiny");

startDt.setAttribute("min", CurrentDay());
endDt.setAttribute("min", CurrentDay());

document.addEventListener("DOMContentLoaded", function () {
  fetch("./IataCode.json")
    .then((res) => res.json())
    .then((data) => {
      fill_list("origin", data);
      fill_list("destiny", data);
    });
});

document.getElementById("nav-roundtrip-tab").addEventListener("click", (e) => {
  flightType.value = 1;
  endDt.removeAttribute("disabled");
});
document.getElementById("nav-going-tab").addEventListener("click", (e) => {
  flightType.value = 0;
  endDt.setAttribute("disabled", "");
});

document.querySelector("input[list]").addEventListener("input", function (e) {
  var input = e.target,
    list = input.getAttribute("list"),
    options = document.querySelectorAll("#" + list + " option"),
    hiddenInput = document.getElementById(input.getAttribute("id") + "-hidden"),
    inputValue = input.value;

  hiddenInput.value = inputValue;

  for (var i = 0; i < options.length; i++) {
    var option = options[i];

    if (option.innerText === inputValue) {
      hiddenInput.value = option.getAttribute("data-value");
      break;
    }
  }
});

function CurrentDay() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

function fill_list(element, json) {
  var opt = "";
  Object.entries(json).forEach(([key, value]) => {
    if (!value.state) {
      opt += `<option data-value="${value.iata}" >${key}, ${value.country}</option>`;
    } else {
      opt += `<option data-value="${value.iata}" >${key}, ${value.state}, ${value.country}</option>`;
    }
  });
  document.getElementById(element).innerHTML = opt;
}
