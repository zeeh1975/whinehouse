const cart = document.getElementById("cart");

function updateButtonsEvents() {
  const purchaseButton = document.getElementById("purchasebutton");
  const emptyCartButton = document.getElementById("emptycartbutton");
  if (emptyCartButton) {
    emptyCartButton.addEventListener("click", function (e) {
      e.preventDefault();
      emptyCart();
    });
  }
  if (purchaseButton) {
    purchaseButton.addEventListener("click", function (e) {
      e.preventDefault();
      makePurchase();
    });
  }
}

// Elimina un item del carrito
async function removeItemFromCart(productId) {
  const errorMsg = "No fue posible eliminar el producto del carrito";
  try {
    const removeProductCartUrl = carritoURL + "/" + usuario.carrito + "/productos/" + productId;
    const responseData = await fetchRequest(removeProductCartUrl, "DELETE");
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      html = await makeCartTable(response.data);
      cart.innerHTML = html;
      updateButtonsEvents();
      return;
    }
    const response = await responseData.text();
    console.log("error removeItemFromCart " + response);
    await mostrarError(errorMsg);
    manageUnauthorized(responseData.status);
  } catch (error) {
    console.log("error removeItemFromCart " + error);
    mostrarError(errorMsg);
  }
}
async function emptyCart() {
  const errorMsg = "No fue posible vaciar el carrito";
  result = await Swal.fire({
    title: "¿Quiere vaciar el carrito?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Si",
    denyButtonText: `No`,
    icon: "question",
  });
  if (result.isConfirmed) {
    try {
      const removeProductCartUrl = carritoURL + "/" + usuario.carrito + "/productos/";
      const responseData = await fetchRequest(removeProductCartUrl, "DELETE");
      if (responseData.status === HTTP_STATUS_OK) {
        html = await makeCartTable([]);
        cart.innerHTML = html;
        return;
      }
      const response = await responseData.text();
      console.log("error emptyCart " + response);
      await mostrarError(errorMsg);
      manageUnauthorized(responseData.status);
    } catch (error) {
      console.log("error emptyCart " + error);
      mostrarError(errorMsg);
    }
  }
}

async function makePurchase() {
  const errorMsg = "No fue posible registrar el pedido";
  result = await Swal.fire({
    title: "¿Desea confirmar el pedido?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Confirmar",
    denyButtonText: `Cancelar`,
    icon: "question",
  });
  if (result.isConfirmed) {
    try {
      const purchaseUrl = carritoURL + "/" + usuario.carrito + "/purchase";
      const responseData = await fetchRequest(purchaseUrl, "POST");
      if (responseData.status === HTTP_STATUS_OK) {
        await Swal.fire({
          title: "Su pedido ha sido registrado.",
          confirmButtonText: "Ok",
        });
        window.location = "/";
        return;
      }
      const response = await responseData.text();
      console.log("error makePurchase " + response);
      await mostrarError(errorMsg);
      manageUnauthorized(responseData.status);
    } catch (error) {
      console.log("error makePurchase " + error);
      mostrarError(errorMsg);
    }
  }
}

function makeCartTable(carrito) {
  return fetch(host + "/assets/views/tabla_carrito.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      cantidadProductosCarrito = 0;
      let importeTotal = 0;
      carrito.forEach((producto) => {
        const precioTotalProducto = producto.precio * producto.stock;
        producto.precioFormateado = "$" + arFormat.format(precioTotalProducto);
        cantidadProductosCarrito += producto.stock;
        importeTotal += precioTotalProducto;
      });
      actualizarCantidadProductosCarrito(cantidadProductosCarrito);
      importeTotal = "$" + arFormat.format(importeTotal);
      const html = template({
        productos: carrito,
        cantidadProductosCarrito,
        importeTotal,
      });
      return html;
    });
}

async function getCartContent() {
  if (!usuario) {
    await getUser();
  }
  let response = {};
  const addProductCartUrl = carritoURL + "/" + usuario.carrito + "/productos";
  const responseData = await fetchRequest(addProductCartUrl, "GET");
  if (responseData.status === HTTP_STATUS_OK) {
    response = await responseData.json();
    response.json = response.data;
  } else {
    response.text = await responseData.text();
  }
  response.status = responseData.status;
  return response;
}

async function getCart() {
  const errorMsg = "No fue posible cargar el carrito";
  try {
    const response = await getCartContent();
    if (response.status === HTTP_STATUS_OK) {
      html = await makeCartTable(response.json);
      cart.innerHTML = html;
      updateButtonsEvents();
      return;
    }
    console.log("error getCart " + response.text);
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error getCart " + error);
    mostrarError(errorMsg);
  }
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.attributes.name.value == "removefromcart") {
    e.preventDefault();
    removeItemFromCart(e.target.id);
  }
});

getCart();
