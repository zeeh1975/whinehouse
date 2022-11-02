const signupForm = document.querySelector("#signupform");
const passwordConfirmation = document.querySelector("#passwordconfirmation");
const password = document.querySelector("#password");
const loginButton = document.querySelector("#loginbutton");
const phoneInputField = document.querySelector("#phonenumber");
const phonenumberInvalidFeedback = document.querySelector("#phonenumber-invalid-feedback");
const imageInput = document.querySelector("#imageInput");
const avatarDisplay = document.querySelector("#avatarDisplay");

// submit formulario login
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signup();
});

loginButton.addEventListener("click", doLogin);

passwordConfirmation.addEventListener("keydown", clearPasswordError);
password.addEventListener("keydown", clearPasswordError);
phoneInputField.addEventListener("keydown", clearPhoneError);

function clearPasswordError() {
  passwordConfirmation.classList.remove("is-invalid");
}
function clearPhoneError() {
  phonenumberInvalidFeedback.style.display = "none";
  phoneInputField.classList.remove("is-invalid");
}

function doLogin() {
  window.location = "/login";
}

async function signup() {
  // chequear el telefono
  const phoneNumber = phoneInput.getNumber();
  if (!phoneInput.isValidNumber()) {
    phonenumberInvalidFeedback.style.display = "block";
    phoneInputField.classList.add("is-invalid");
    phoneInputField.focus();
    return;
  }
  // chequear la contraseña
  if (signupForm.password.value != signupForm.passwordconfirmation.value) {
    passwordConfirmation.classList.add("is-invalid");
    passwordConfirmation.focus();
    return;
  }

  try {
    const host = window.location.protocol + "//" + window.location.host;
    const destURL = new URL("/signup", host);
    var data = new FormData();
    data.append("name", signupForm.name.value);
    data.append("address", signupForm.address.value);
    data.append("age", signupForm.age.value);
    data.append("phoneNumber", phoneNumber);
    data.append("avatar", signupForm.avatar.files[0]);
    data.append("email", signupForm.email.value);
    data.append("password", signupForm.password.value);

    const responseData = await fetch(destURL, {
      method: "POST",
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "multipart/form-data",
      // },
      body: data,
    });
    if (responseData.status === HTTP_STATUS_OK) {
      document.location.href = "/";
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
    console.log("error signup=", error);
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "No fue posible completar el registro",
    });
  }
}

const phoneInput = window.intlTelInput(phoneInputField, {
  initialCountry: "ar",
  preferredCountries: ["ar", "bo", "br", "cl", "co", "ec", "py", "ve"],
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

imageInput.onchange = (evt) => {
  const [file] = imageInput.files;
  if (file) {
    avatarDisplay.src = URL.createObjectURL(file);
  }
};

//
// signupForm.name.value = "Nombre Apellido";
// signupForm.address.value = "Direccion 123";
// signupForm.age.value = 33;
// signupForm.phonenumber.value = "2916442616";
// signupForm.email.value = "eehernandez@gmail.com";
// signupForm.password.value = "1234";
// signupForm.passwordconfirmation.value = "1234";
