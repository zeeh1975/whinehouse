const loginForm = document.querySelector("#loginform");
const passwordConfirmation = document.querySelector("#passwordconfirmation");
const signUpButton = document.querySelector("#signupbutton");

// submit formulario login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

signUpButton.addEventListener("click", doSignUp);

function doSignUp() {
  window.location = "/signup";
}

async function login() {
  try {
    const host = window.location.protocol + "//" + window.location.host;
    const destURL = new URL("/login", host);
    const responseData = await fetch(destURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginForm.email.value,
        password: loginForm.password.value,
      }),
    });
    if (responseData.status === HTTP_STATUS_OK) {
      const response = await responseData.json();
      const redirUrl = response.data.redirUrl;
      if (redirUrl) {
        document.location.href = redirUrl;
      } else {
        document.location.href = "/products";
      }
    } else {
      // si el resultado no es el esperado
      // se muestra un mensaje con el error
      response = await responseData.json();

      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: response.message,
      });
    }
  } catch (error) {
    console.log("error=", error);
  }
}
