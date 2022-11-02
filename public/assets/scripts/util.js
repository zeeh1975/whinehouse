const host = window.location.protocol + "//" + window.location.host;
const carritoURL = new URL("api/carrito", host);

async function mostrarMensajeError(errorMsg) {
  if (typeof Swal !== "undefined") {
    await Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: errorMsg,
    });
  } else {
    alert(errorMsg);
  }
}

async function mostrarError(errorMsg) {
  if (errorMsg.descripcion) {
    errorMsg = errorMsg.descripcion;
  } else if (errorMsg.message) {
    errorMsg = errorMsg.message;
  } else if (errorMsg.error) {
    errorMsg = errorMsg.error;
  }
  await mostrarMensajeError(errorMsg);
}

async function fetchRequest(destURL, method, body) {
  return await fetch(destURL, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
}

function formateaPrecios(productos) {
  return productos.map((producto) => {
    producto.precioFormateado = "$" + arFormat.format(producto.precio);
    return producto;
  });
}

const arFormat = Intl.NumberFormat("es-AR");

function manageUnauthorized(status) {
  if (status === HTTP_STATUS_ERROR_UNAUTHORIZED) {
    document.location.href = "/";
  }
}
