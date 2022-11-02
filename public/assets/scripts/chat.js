const chatForm = document.querySelector("#chatForm");

const socket = io.connect();

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

// renderiza la lista de mensajes del chat
// con la plantilla predefinida
function makeChatTable(mensajes) {
  return fetch("/assets/views/tabla_chat.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template({ mensajes });
      return html;
    });
}

// websocket: envia un nuevo mensaje
// de chat al servidor
function sendMessage() {
  const mensaje = {
    text: chatForm.mensaje.value,
  };
  socket.emit("mensaje", mensaje);
  chatForm.mensaje.value = "";
  chatForm.mensaje.focus();
}

// websocket: recibe los mensajes de chat

async function socketSetup() {
  if (!usuario) {
    await setupUser();
  }
  const channel = "mensajes_" + usuario.id;
  console.log("*" + channel + "*");

  socket.on(channel, (mensajes) => {
    console.log(mensajes);
    makeChatTable(mensajes).then((html) => {
      document.getElementById("chat").innerHTML = html;
    });
  });

  socket.on("error", (err) => {
    console.log("Socket err: " + err);
  });

  socket.emit("mensajes", "");
}

socketSetup();
