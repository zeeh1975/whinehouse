import mongoose from "mongoose";
const chatCollection = "chat";

const ChatSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  timestamp: { type: String, required: true, max: 20 },
  tipo: { type: String, required: true },
  mensaje: { type: String, required: true },
  leido: { type: Boolean, required: true },
});

export default mongoose.model(chatCollection, ChatSchema);
