const urlNasa = "https://api.nasa.gov/planetary/apod";
const llave = "golR3aQfVtZ72B5bCQqc8SUN4EEzAZlCZ11kWFlh";

const apodCont = document.getElementById("apodContainer");
const dateInput = document.getElementById("inputDate");
const favList = document.getElementById("listaFavoritos");
const btnB = document.getElementById("Btnbuscar");
const btnFav = document.getElementById("BtnFavoritos");

const titulo = document.getElementById("apodTitulo");
const fecha = document.getElementById("apodDate");
const media = document.getElementById("apodMedia");
const descrip = document.getElementById("apodDescripcion");

let imagenActual = null;

// Pedir datos a la API
function pedirDatos(date) {
  let url = urlNasa + "?api_key=" + llave;

  if (date) {
    url = url + "&date=" + date;
  }

  fetch(url)
    .then(function (response) {
      return response.json();
      console.log(response);
      
    })
    .then(function (data) {
      mostrarDatos(data);
      console.log(data);
      
    })
    .catch(function (error) {
      console.log("No puedes seleccionar fechas futuras", error);
    });
}

// Mostrar datos
function mostrarDatos(data) {
  imagenActual = data;

  titulo.textContent = data.title;
  fecha.textContent = data.date;
  descrip.textContent = data.explanation;

  media.innerHTML = "";

  if (data.media_type === "image") {
    const imgn = document.createElement("img");
    imgn.src = data.url;
    imgn.style.width = "100%";
    media.appendChild(imgn);
  } else {
    const iframe = document.createElement("iframe");
    iframe.src = data.url;
    iframe.width = "100%";
    iframe.height = "400px";
    media.appendChild(iframe);
  }

  btnFav.style.display = "block";
}

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

// Buscar por fecha
btnB.addEventListener("click", function () {
  let selecFecha = dateInput.value;

  let hoy = new Date().toISOString().split("T")[0]; //.toISOString() es para convertir la fecha a formato estándar internacional

  if (!selecFecha) {
    alert("Selecciona primero una fecha");
    return;
  }
  if (selecFecha > hoy) {
    alert("No puedes seleccionar fechas futuras");
    return;
  }

  pedirDatos(selecFecha);
});

//Guardar Favoritos
btnFav.addEventListener("click", function () {
  if (imagenActual === null) return;

  let favorito = obtenerFavoritos()

  let existe = favorito.some(item => item.date === imagenActual.date);

  if (existe) {
    alert("Ya está en favoritos");
    return;
  }

  favorito.push(imagenActual);

  localStorage.setItem("favoritos", JSON.stringify(favorito)); //.stringify convertir a texto

  mostrarFavoritos();
});

//Mostrar Favoritos
function mostrarFavoritos() {
  favList.innerHTML = "";

  let favorito = obtenerFavoritos()

  for (let i = 0; i < favorito.length; i++) {
    let item = favorito[i];

    let li = document.createElement("li");
    li.textContent = item.date + " - " + item.title;

    //Accion de mostrar imagen al hacer click
    li.addEventListener("click", function () {
        mostrarDatos(item);
    
    });

 let btnEliminar = document.createElement("button");
    btnEliminar.textContent = "X";
    btnEliminar.classList.add("btn-eliminar");

    btnEliminar.addEventListener("click", function(){

      eliminarFavorito(item.date);
    });

    li.appendChild(btnEliminar);

    favList.appendChild(li);
  }
}

function eliminarFavorito(date) {
  let favoritos = obtenerFavoritos();

  favoritos = favoritos.filter(item => item.date !== date);

  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  mostrarFavoritos();
}


pedirDatos("");
mostrarFavoritos();

/*estrellas fondo */
const starsContainer = document.querySelector(".stars");

for (let i = 0; i < 60; i++) {
  let star = document.createElement("div");
  star.classList.add("star");

  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";

  star.style.animationDuration = 2 + Math.random() * 5 + "s";
  star.style.opacity = Math.random();

  starsContainer.appendChild(star);
}
