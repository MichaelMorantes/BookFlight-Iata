// Obtiene los elementos del formulario y del iframe
var form = document.getElementById("form");

// Obtiene los elementos del formulario necesarios para manipular las fechas y las listas desplegables
var flightType = document.getElementById("flightType");
var startDt = document.getElementById("startDt");
var endDt = document.getElementById("endDt");
var startPt = document.getElementById("startPt");
var endPt = document.getElementById("endPt");
var datalist = document.getElementById("IataCodeList");

// Establece el atributo "min" de los elementos de fecha para que no puedan seleccionar fechas anteriores al día actual
startDt.setAttribute("min", CurrentDay());
endDt.setAttribute("min", CurrentDay());

// Agrega un controlador de eventos para el envío del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();
  // Reemplaza los guiones ("-") de las fechas por una cadena vacía para darles el formato "YYYYMMDD"
  document.getElementById("startDt-hidden").value = startDt.value.replace(/\-/g, "");
  document.getElementById("endDt-hidden").value = endDt.value.replace(/\-/g, "");

  // Convierte los datos del formulario a un objeto JSON y los envía al servidor
  const formData = new FormData(e.target);
  const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
  console.log(jsonData);
  form.submit();
});

// Agrega un controlador de eventos para los elementos de lista desplegable de los aeropuertos
[startPt, endPt].forEach(function (element) {
  element.addEventListener("keyup", (e) => {
    // Si el usuario ha ingresado al menos 3 caracteres en el campo de búsqueda, muestra la lista de sugerencias
    if (e.target.value.length >= 3) {
      datalist.setAttribute("id", "IataCodeList");
    } else {
      // Si el usuario ha ingresado menos de 3 caracteres, oculta la lista de sugerencias
      datalist.setAttribute("id", "");
    }
  });
});

// Carga el archivo "IataCode.json" y llena las listas desplegables con los datos
document.addEventListener("DOMContentLoaded", function () {
  fetch("./IataCode.json")
    .then((res) => res.json())
    .then((data) => {
      Fill_list("IataCodeList", data);
    });
});

// Agrega un controlador de eventos para los botones de selección de tipo de vuelo
document.getElementById("nav-roundtrip-tab").addEventListener("click", (e) => {
  flightType.value = 1;
  endDt.removeAttribute("disabled");
});
document.getElementById("nav-going-tab").addEventListener("click", (e) => {
  flightType.value = 0;
  endDt.setAttribute("disabled", "");
});

// Agrega un controlador de eventos para el evento "input" de cualquier elemento <input> con un atributo "list" definido
[startPt, endPt].forEach(function (element) {
  element.addEventListener("input", function (e) {
    // Obtiene el elemento <input> que generó el evento "input"
    var input = e.target,
      // Obtiene el valor del atributo "list" del elemento <input>
      list = input.getAttribute("list"),
      // Obtiene todos los elementos <option> dentro del elemento <datalist> correspondiente al atributo "list" del elemento <input>
      options = document.querySelectorAll("#" + list + " option"),
      // Obtiene un elemento <input> oculto cuyo ID es el ID del elemento <input> + "-hidden"
      hiddenInput = document.getElementById(input.getAttribute("id") + "Code-hidden"),
      hiddenInputName = document.getElementById(input.getAttribute("id") + "-hidden"),
      // Obtiene el valor actual del elemento <input>
      inputValue = input.value;
    // Establece el valor del elemento <input> oculto como el valor actual del elemento <input>
    hiddenInput.value = inputValue;
    hiddenInputName.value = inputValue.split(",")[0];

    // Itera sobre cada elemento <option> dentro del elemento <datalist>
    for (var i = 0; i < options.length; i++) {
      // Obtiene la opción actual en la iteración
      var option = options[i];
      // Si el texto de la opción coincide con el valor actual del elemento <input>...
      if (option.innerText === inputValue) {
        // Establece el valor del elemento <input> oculto como el valor del atributo "data-value" de la opción correspondiente
        hiddenInput.value = option.getAttribute("data-value");
        hiddenInputName.value = inputValue.split(",")[0];
        // Sale del ciclo for
        break;
      }
    }
  });
});

// Definimos una función llamada CurrentDay que no recibe argumentos
function CurrentDay() {
  // Creamos una instancia del objeto Date
  var today = new Date();
  // Obtenemos el día del mes
  var dd = today.getDate();
  // Obtenemos el mes (el método getMonth() devuelve valores entre 0 y 11, por lo que le sumamos 1)
  var mm = today.getMonth() + 1;
  // Obtenemos el año
  var yyyy = today.getFullYear();
  // Si el día del mes es menor a 10, le añadimos un 0 al principio para que tenga dos dígitos
  if (dd < 10) dd = "0" + dd;
  // Si el mes es menor a 10, le añadimos un 0 al principio para que tenga dos dígitos
  if (mm < 10) mm = "0" + mm;
  // Creamos una cadena con la fecha en formato "yyyy-mm-dd"
  today = yyyy + "-" + mm + "-" + dd;
  // Retornamos la fecha
  return today;
}

// Esta función recibe un elemento HTML y un objeto JSON.
function Fill_list(element, json) {
  var opt = "";
  Object.entries(json).forEach(([key, value]) => {
    // Si la clave del objeto JSON tiene un valor de "state", se agrega el estado a la opción, de lo contrario solo se muestra el país.
    // Crea una lista de opciones para el elemento HTML proporcionado y la rellena con los datos del objeto JSON.
    if (!value.state) {
      opt += `<option data-value="${value.iata}" >${key}, ${value.country}</option>`;
    } else {
      opt += `<option data-value="${value.iata}" >${key}, ${value.state}, ${value.country}</option>`;
    }
  });
  // Finalmente, actualiza el contenido HTML del elemento con la lista de opciones creada.
  document.getElementById(element).innerHTML = opt;
}
