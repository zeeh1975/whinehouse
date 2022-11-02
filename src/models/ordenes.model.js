import mongoose from "mongoose";
const ordenesCollection = "ordenes";

var CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
var counter = mongoose.model("counter", CounterSchema);

const OrdenesSchema = new mongoose.Schema({
  numero: { type: String },
  timestamp: { type: String, required: true, max: 20 },
  usuario: { type: String, required: true },
  estado: { type: String, required: true },
  productos: { type: Array, required: true },
});

OrdenesSchema.pre("save", async function () {
  let doc = this;
  const result = await counter.findByIdAndUpdate({ _id: "ordenes" }, { $inc: { seq: 1 } });
  if (result) {
    doc.numero = result.seq;
  } else {
    await counter.insertMany({ _id: "ordenes", seq: 1 });
    doc.numero = 1;
  }
});

export default mongoose.model(ordenesCollection, OrdenesSchema);
