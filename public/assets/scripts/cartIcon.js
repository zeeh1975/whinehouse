const cartButtonBadge = document.getElementById("cartbutton__badge");

function actualizarCantidadProductosCarrito(cantidadProductos) {
  cartButtonBadge.innerHTML = cantidadProductos;
  if (cantidadProductos > 0) {
    cartButtonBadge.classList.remove("visually-hidden");
  } else {
    cartButtonBadge.classList.add("visually-hidden");
  }
}

async function showCartItemCount() {
  try {
    if (!usuario) {
      await getUser();
    }
    const addProductCartUrl = carritoURL + "/" + usuario.carrito + "/productos/count";
    const responseData = await fetchRequest(addProductCartUrl, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      actualizarCantidadProductosCarrito(response.data.itemsCount);
      return;
    }
    actualizarCantidadProductosCarrito(0);
  } catch (error) {
    actualizarCantidadProductosCarrito(0);
  }
}

showCartItemCount();
