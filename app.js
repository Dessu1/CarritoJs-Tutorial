/**
 *  Nos aseguramos de que cargue el script
 */
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = async () => {
  try {
    /**
     *  Consumimos la API
     */
    const res = await fetch("api.json");
    const data = await res.json();
    pintarProductos(data);
    detectarBotones(data);
  } catch (error) {
    console.log(error);
  }
};

/**
 *  Obtenemos el div donde van a ir los productos por medio del id
 */
const contenedorProductos = document.querySelector("#contenedor-productos");
const pintarProductos = (data) => {
  /**
   *  Obtenemos el div donde van a estar pintados los productos
   */
  const template = document.querySelector("#template-producto").content;
  const fragment = document.createDocumentFragment(); // new DocumentFragment() --> Hacen los mismo

  data.forEach((producto) => {
    /**
     * Seleccionamos lo que queremos para insertar los datos
     * --- setAtribute(a,b), a -> seleciona donde queremos agregar : b -> agrega el contenido
     */
    template.querySelector("img").setAttribute("src", producto.thumbnailUrl);
    template.querySelector("h5").textContent = producto.title;
    template.querySelector("p span").textContent = producto.precio;
    /**
     *  Le agregamos un data-id a cada boton que crea
     */
    template.querySelector("button").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });

  contenedorProductos.appendChild(fragment);
};

let carrito = {};

const detectarBotones = (data) => {
  const botones = document.querySelectorAll(".card button");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = data.find(
        (item) => item.id === parseInt(btn.dataset.id)
      );
      /**
       *  se crea un campo de cantidad en los productos
       */
      producto.cantidad = 1;
      if (carrito.hasOwnProperty(producto.id)) {
        /**
         *  Aumento de cantidad de los productos
         */
        producto.cantidad = carrito[producto.id].cantidad + 1;
      }

      carrito[producto.id] = { ...producto };
      pintarCarrito();
    });
  });
};

const items = document.querySelector("#items");

const pintarCarrito = () => {
  items.innerHTML = "";

  const template = document.querySelector("#template-carrito").content;
  const fragment = document.createDocumentFragment();

  Object.values(carrito).forEach((producto) => {
    template.querySelector("th").textContent = producto.id;
    template.querySelectorAll("td")[0].textContent = producto.title;
    template.querySelectorAll("td")[1].textContent = producto.cantidad;
    template.querySelectorAll("td")[3].textContent =
      producto.cantidad * producto.precio;

    template.querySelector(".btn-info").dataset.id = producto.id;
    template.querySelector(".btn-danger").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  pintarFooter();
  accionBotones();
};

const footer = document.querySelector("#footer-carrito");

const pintarFooter = () => {
  footer.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío!</th>
      `;

    return;
  }
  const template = document.querySelector("#template-footer").content;
  const fragment = document.createDocumentFragment();

  /**
   *  Sumar Cantidad productos
   */
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  const nTotal = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  template.querySelectorAll("td")[0].textContent = nCantidad;
  template.querySelector("span").textContent = nTotal;

  const clone = template.cloneNode(true);
  fragment.appendChild(clone);

  footer.appendChild(fragment);

  const boton = document.querySelector("#vaciar-carrito");

  boton.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll("#items .btn-info");
  const botonesEliminar = document.querySelectorAll("#items .btn-danger");

  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carrito[btn.dataset.id];
      producto.cantidad++;
      carrito[btn.dataset.id] = { ...producto };
      pintarCarrito();
    });
  });
  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carrito[btn.dataset.id];
      producto.cantidad--;

      if (producto.cantidad === 0) {
        delete carrito[btn.dataset.id];
        pintarCarrito();
      } else {
        carrito[btn.dataset.id] = { ...producto };
        pintarCarrito();
      }
    });
  });
};
