let arr = [3, 6, 2, 7, 1, 9, 4, 3, 6, 8, 3];
console.log(
  arr.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else return 0;
  })
);

let nombres = [
  "Sys admin",
  "Eduardo Hernandez",
  "prueba1",
  "prueba1",
  "prueba2",
  "Sta. Jennifer Nevárez",
  "Ana Becerra",
  "Rubén Valladares",
  "Josep Córdova",
  "Roser Perea",
  "Roser Negrón",
  "Rubén Galván",
  "Pedro Espinosa de los Monteros",
  "María de los Ángeles Padrón",
];
console.log(
  nombres.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else return 0;
  })
);
