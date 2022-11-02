import { productosDAO } from "../daos/index.js";

async function test() {
  const test = await productosDAO.getAll({ categoria: "espumantes" }, { nombre: 1 });
  await productosDAO.disconnect();
  console.log(test);
}

test();
