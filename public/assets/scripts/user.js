const defaultUser = { usuario: null, isAdmin: false };

async function getUser() {
  try {
    const host = window.location.protocol + "//" + window.location.host;
    const destURL = new URL("/api/usuario/info", host);
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
      return defaultUser;
    }
  } catch (error) {
    return defaultUser;
  }
}

let usuario;

async function setupUser() {
  usuario = await getUser();
}

setupUser();
