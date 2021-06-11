const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});
cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("https://henry-bsale-test-backend.herokuapp.com/");
    const data = await res.json();

    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  data.forEach((producto) => {
    if (producto.url_image) {
      templateCard.querySelector("h5").textContent = producto.name;
      templateCard.querySelector("p").textContent = producto.price;
      templateCard.querySelector("img").setAttribute("src", producto.url_image);
      templateCard.querySelector(
        ".btn-dark",
        ".fas fa-cart-arrow-down"
      ).dataset.id = producto.id;
      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone);
    }
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark", "fas fa-cart-arrow-down")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objecto) => {
  const producto = {
    id: objecto.querySelector(".btn-dark", ".fas fa-cart-arrow-down").dataset
      .id,
    title: objecto.querySelector("h5").textContent,
    precio: objecto.querySelector("p").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  //console.log(carrito);
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  pintarFooter();
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const btnAccion = (e) => {
  //console.log(e.target);
  if (e.target.classList.contains("btn-info")) {
    //console.log(carrito[e.target.dataset.id]);
    //carrito[e.target.dataset.id]
    const producto = carrito[e.target.dataset.id];
    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
    //resumen de linea 125
    // producto.cantidad++
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation();
};
