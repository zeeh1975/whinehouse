import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

async function connect(mongoose, url) {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function isValidObjectId(Id) {
  const oid = new ObjectId(Id);
  const newId = oid._id + "";
  if (newId === Id) return true;
  return false;
}

function formatItem(Obj) {
  if (Obj) {
    Obj.id = Obj._id;
    delete Obj._id;
    delete Obj.__v;
  }
  return Obj;
}

export { connect, formatItem, isValidObjectId };
