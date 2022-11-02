import mongoose from "mongoose";
const carritosCollection = "carritos";

const CarritosSchema = new mongoose.Schema({
  timestamp: { type: String, required: true, max: 20 },
  usuario: { type: String, required: true },
  productos: { type: Array, required: true },
});

export default mongoose.model(carritosCollection, CarritosSchema);
