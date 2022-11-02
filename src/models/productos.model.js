import mongoose from "mongoose";
const productosCollection = "productos";

const ProductosSchema = new mongoose.Schema({
  timestamp: { type: String, required: true, max: 20 },
  nombre: { type: String, required: true, max: 100 },
  descripcion: { type: String, required: true, max: 100 },
  codigo: { type: String, required: true, max: 100 },
  categoria: { type: String, required: true, max: 100 },
  foto: { type: String, required: true, max: 1000 },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
});

export default mongoose.model(productosCollection, ProductosSchema);
