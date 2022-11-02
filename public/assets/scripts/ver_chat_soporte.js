const chatForm = document.querySelector("#chatForm");
const sendMessageBtn = document.querySelector("#sendMessageBtn");
const markAsReadedBtn = document.querySelector("#markAsReadedBtn");
const goBackBtn = document.querySelector("#goBackBtn");
const arrLocation = window.location.pathname.split("/");
const usuarioId = arrLocation[arrLocation.length - 1];
const chatURL = new URL("/api/chat/", host);
const userChatURL = new URL("/api/chat/" + usuarioId, host);

sendMessageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage(chatForm.mensaje.value);
});

markAsReadedBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage("");
});

goBackBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "/chat";
  return;
});

async function sendMessage(text) {
  try {
    const responseData = await fetchRequest(
      chatURL,
      "POST",
      JSON.stringify({
        usuario: usuarioId,
        text,
      })
    );
    if (responseData.status === HTTP_STATUS_OK) {
      window.location = "/chat";
    } else {
      // se muestra un mensaje con el error
      response = await responseData.json();
      mostrarError(response);
    }
  } catch (error) {
    console.log("error=", error);
  }
}

function makeChatTable(data) {
  return fetch("/assets/views/tabla_chat.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template(data);
      return html;
    });
}

async function getMensajesUsuario() {
  const errorMsg = "No fue posible obtener la lista de mensajes";
  try {
    const responseData = await fetchRequest(userChatURL, "GET");
    if (responseData.status === HTTP_STATUS_OK) {
      response = await responseData.json();
      makeChatTable(response.data).then((html) => {
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

  await getMensajesUsuario();
}

run();
