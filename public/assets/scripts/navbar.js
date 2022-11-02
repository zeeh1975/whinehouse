function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, false);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

// marcar si corresponde el item actual
function setActiveItem() {
  const cp = window.location.pathname;
  if (cp == "/") {
    const label = document.getElementById("navbar_inicio");
    label.classList.add("btn");
    label.classList.add("btn-outline-primary");
    label.classList.add("btn-sm");
  }
  if (cp == "/products") {
    const label = document.getElementById("navbar_productos");
    label.classList.add("btn");
    label.classList.add("btn-outline-primary");
    label.classList.add("btn-sm");
  }
  if (cp == "/profile") {
    const label = document.getElementById("navbar_micuenta");
    label.classList.add("btn");
    label.classList.add("btn-outline-primary");
    label.classList.add("btn-sm");
  }
  if (cp == "/chat") {
    const label = document.getElementById("navbar_mensajes");
    label.classList.add("btn");
    label.classList.add("btn-outline-primary");
    label.classList.add("btn-sm");
  }
}

function updateActiveItem() {
  const navbar = document.getElementById("navbar");
  if (!navbar) {
    setTimeout(() => {
      updateActiveItem();
    }, 10);
  } else {
    setActiveItem();
  }
}

async function setupNavbar() {
  const loginBtn = document.querySelector("#loginbtn");
  if (!usuario) {
    await setupUser();
  }
  if (usuario.usuario) {
    loginBtn.innerHTML = "Salir";
    loginBtn.href = "/logout";
  }
}

includeHTML();
window.scrollTo(0, 0);
updateActiveItem();
setupNavbar();

const cartButton = document.getElementById("cartbutton");
cartButton.addEventListener("click", function (e) {
  e.preventDefault();
  document.location.href = "/cart";
});
