const chatURL = new URL("api/chat", host);

function parseUsers(usuarios) {
  const noLeidos = [];
  const leidos = [];
  for (const usuario of usuarios) {
    usuario.link = "/chat/" + usuario.id;
    if (usuario.noLeido) {
      noLeidos.push(usuario);
    } else {
      leidos.push(usuario);
    }
  }
  return { noLeidos, leidos };
}

function makeUserChatTable(usuarios) {
  return fetch(host + "/assets/views/tabla_chat_soporte.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      leidosNoLeidos = parseUsers(usuarios);
      //productosFormateados = formateaPrecios(productos);
      const html = template(leidosNoLeidos);
      return html;
    });
}

// obtiene la lista de mensajes no leidos
async function getMensajesNoLeidos() {
  const errorMsg = "No fue posible obtener la lista de mensajes";
  try {
    const responseData = await fetchRequest(chatURL, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      makeUserChatTable(response.data).then((html) => {
        document.getElementById("chat").innerHTML = html;
      });
      return;
    }
    mostrarError(errorMsg);
  } catch (error) {
    console.log("error=", error);
    mostrarError(errorMsg);
  }
}

// Configuraciones de la app
async function run() {
  if (!usuario) {
    await getUser();
  }

  await getMensajesNoLeidos();
}

run();
