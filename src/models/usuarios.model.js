import mongoose from "mongoose";
const usuariosCollection = "usuarios";

const UsuariosSchema = new mongoose.Schema({
  nombreApellido: { type: String, required: true },
  direccion: { type: String, required: true },
  email: { type: String, required: true },
  edad: { type: Number, required: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

export default mongoose.model(usuariosCollection, UsuariosSchema);
