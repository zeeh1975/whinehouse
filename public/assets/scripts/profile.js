const profileForm = document.querySelector("#profileform");
const avatarDisplay = document.querySelector("#avatarDisplay");

document.addEventListener("click", function (e) {
  if (e.target && e.target.attributes.name.value == "viewOrderBtn") {
    e.preventDefault();
    viewOrderDetail(e.target.id);
  }
});

function viewOrderDetail(orderNo) {
  const order = orders.find((v) => v.numero === orderNo);
  if (order) {
    let detail = "";
    order.productos.forEach((producto) => {
      detail +=
        producto.stock + "x" + producto.nombre + " $" + producto.precio * producto.stock + "<br>";
    });
    Swal.fire({
      title: "Detalle orden " + order.numero,
      html: detail,
      icon: "info",
    });
  }
}

async function getProfile() {
  try {
    const host = window.location.protocol + "//" + window.location.host;
    const destURL = new URL("/api/usuario/profile", host);
    const responseData = await fetch(destURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      return response.data;
    } else {
      return {};
    }
  } catch (error) {
    return {};
  }
}

async function getOrders() {
  try {
    const host = window.location.protocol + "//" + window.location.host;
    const destURL = new URL("/api/ordenes", host);
    const responseData = await fetch(destURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

function formatDate(date) {
  const dateObj = new Date(parseInt(date));
  return dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear();
}

function parseOrders(orders) {
  orders.forEach((element) => {
    let cantidadTotal = 0;
    let importeTotal = 0;
    element.productos.forEach((producto) => {
      cantidadTotal += producto.stock;
      importeTotal += producto.precio * producto.stock;
    });
    element.cantidadTotal = cantidadTotal;
    element.importeTotal = importeTotal;
    element.fecha = formatDate(element.timestamp);
  });
  return orders;
}

function makeOrdersTable(ordenes) {
  return fetch("/assets/views/tabla_ordenes.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const parsedOrders = parseOrders(ordenes);
      const html = template({ orders: parsedOrders });
      return html;
    });
}

let orders;

async function loadProfile() {
  const profile = await getProfile();
  if (profile.nombreApellido) {
    profileForm.name.value = profile.nombreApellido;
    profileForm.address.value = profile.direccion;
    profileForm.age.value = profile.edad;
    profileForm.phonenumber.value = profile.telefono;
    profileForm.email.value = profile.email;
    avatarDisplay.src = "/avatars/" + profile.avatar;
    orders = await getOrders();
    if (orders) {
      makeOrdersTable(orders).then((html) => {
        document.getElementById("ordenes").innerHTML = html;
      });
    }
  } else {
    loginBtn.href = "/login";
  }
}

loadProfile();
