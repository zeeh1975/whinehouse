const productForm = document.querySelector("#productForm");
const listaProductos = document.querySelector("#productos");
const addNewProductDiv = document.querySelector("#addnewproductdiv");
const addNewProductButton = document.querySelector("#addnewproductbutton");
const modalProductForm = document.querySelector("#modalProductForm");
const modalProductFormTitle = document.querySelector("#modalProductFormTitle");

const productosURL = new URL("api/productos", host);
const usuarioURL = new URL("api/usuario", host);
let cantidadProductosCarrito = 0;
let processProduct;
let activeModalProductForm;

// borrar un carrito
async function borrarCarrito(carrito) {
  const errorMsg = "No fue posible borrar el carrito";
  try {
    const responseData = await fetchRequest(carritoURL + "/" + carrito, "DELETE");
    if (responseData.status === HTTP_STATUS_OK) {
      return;
    }
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// Productos
// Agrega un nuevo producto
async function addProduct() {
  try {
    const responseData = await fetchRequest(
      productosURL,
      "POST",
      JSON.stringify({
        nombre: productForm.nombre.value,
        descripcion: productForm.descripcion.value,
        codigo: productForm.codigo.value,
        foto: productForm.foto.value,
        precio: productForm.precio.value,
        stock: productForm.stock.value,
      })
    );
    if (responseData.status === HTTP_STATUS_CREATED) {
      activeModalProductForm.hide();
      getProductos();
    } else {
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

// Actualiza los datos de un producto
async function updateProduct(productId) {
  try {
    const responseData = await fetchRequest(
      productosURL + "/" + productId,
      "PUT",
      JSON.stringify({
        nombre: productForm.nombre.value,
        descripcion: productForm.descripcion.value,
        codigo: productForm.codigo.value,
        foto: productForm.foto.value,
        precio: productForm.precio.value,
        stock: productForm.stock.value,
      })
    );
    if (responseData.status === HTTP_STATUS_OK) {
      activeModalProductForm.hide();
      getProductos();
    } else {
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response.message);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

// borra un producto
async function deleteProduct(productId) {
  try {
    const responseData = await fetchRequest(productosURL + "/" + productId, "DELETE");
    if (responseData.status === HTTP_STATUS_OK) {
      getProductos();
    } else {
      // si el resultado no es el esperado
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

// obtiene los detalles de un producto
async function getProductData(productId) {
  try {
    const responseData = await fetchRequest(productosURL + "/" + productId, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      return response.data;
    }
    return null;
  } catch (error) {
    console.log("error=", error);
    return null;
  }
}

// Contenido
// renderiza la lista de productos mediante la plantilla predefinida
function makeProductTable(productos) {
  return fetch(host + "/assets/views/tabla_productos.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      productosFormateados = formateaPrecios(productos);
      const html = template({
        isAdmin: usuario.isAdmin,
        productos: productosFormateados,
      });
      return html;
    });
}

// obtiene la lista de productos y la inserta en la pagina
async function getProductos() {
  const errorMsg = "No fue posible obtener la lista de productos";
  try {
    const responseData = await fetchRequest(productosURL, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      makeProductTable(response.data).then((html) => {
        document.getElementById("productos").innerHTML = html;
      });
      return;
    }
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// agrega un producto al carrito
async function agregarProductoCarrito(idProducto) {
  const errorMsg = "No fue posible agregar el producto al carrito";
  try {
    const addProductCartUrl = carritoURL + "/" + usuario.carrito + "/productos";
    const responseData = await fetchRequest(
      addProductCartUrl,
      "POST",
      JSON.stringify({ idProducto })
    );
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      actualizarCantidadProductosCarrito(response.data.itemsCount);
      return;
    }
    response = await responseData.text();
    console.log(response);
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// Presenta el formulario para editar un producto
async function editProduct(productId) {
  modalProductFormTitle.innerHTML = "Editar producto";
  activeModalProductForm = new bootstrap.Modal(modalProductForm);
  processProduct = updateProduct.bind(null, productId);
  producto = await getProductData(productId);
  if (producto) {
    productForm.nombre.value = producto.nombre;
    productForm.descripcion.value = producto.descripcion;
    productForm.codigo.value = producto.codigo;
    productForm.foto.value = producto.foto;
    productForm.precio.value = producto.precio;
    productForm.stock.value = producto.stock;
    activeModalProductForm.show();
  } else {
    mostrarError("No fue posible obtener el producto");
  }
}

// Presenta el formulario para agregar un producto
async function addNewProduct(productId) {
  modalProductFormTitle.innerHTML = "Agregar producto";
  activeModalProductForm = new bootstrap.Modal(modalProductForm);
  processProduct = addProduct.bind(null, productId);
  productForm.reset();
  activeModalProductForm.show();
}

// Confirma la elimiancion de un producto
async function removeProduct(productId) {
  result = await Swal.fire({
    title: "¿Está seguro que quiere eliminar el producto?",
    icon: "question",
    showCancelButton: true,
    showConfirmButton: false,
    showDenyButton: true,
    cancelButtonText: "Cancelar",
    denyButtonText: `Eliminar`,
  });

  if (result.isDenied) {
    // eliminar
    deleteProduct(productId);
  }
}

// Eventos

if (listaProductos) {
  listaProductos.addEventListener("click", (e) => {
    if (e.target.name === "cartAdd") {
      e.preventDefault();
      const productId = e.target.id;
      agregarProductoCarrito(productId);
    }
  });
}

if (addNewProductButton) {
  addNewProductButton.addEventListener("click", (e) => {
    e.preventDefault();
    addNewProduct();
  });
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.attributes.name.value == "editproduct") {
    e.preventDefault();
    editProduct(e.target.id);
  }
  if (e.target && e.target.attributes.name.value == "removeproduct") {
    e.preventDefault();
    removeProduct(e.target.id);
  }
});

// pone el foco en el campo nombre al mostrar el modal
if (modalProductForm) {
  modalProductForm.addEventListener("shown.bs.modal", (e) => {
    productForm.nombre.focus();
  });
}

// submit formulario productos
if (productForm) {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    processProduct();
  });
}

// Configuraciones de la app
async function run() {
  if (!usuario) {
    await getUser();
  }
  //mostrar el boton de agregar producto si se trata del adiministrador
  if (usuario.isAdmin) {
    addNewProductDiv.style = "";
  }
  await getProductos();
}

run();
