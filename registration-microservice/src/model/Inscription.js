import mongoose from "mongoose";

const inscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    trim: true,
    maxlength: [100, "El nombre no puede exceder 100 caracteres"],
  },
  lastName: {
    type: String,
    required: [true, "El apellido es requerido"],
    trim: true,
    maxlength: [100, "El apellido no puede exceder 100 caracteres"],
  },
  email: {
    type: String,
    required: [true, "El email es requerido"],
    trim: true,
    maxlength: [100, "El email no puede exceder 100 caracteres"],
  },
  phone: {
    type: String,
    required: [true, "El telefono es requerido"],
    trim: true,
    maxlength: [100, "El telefono no puede exceder 100 caracteres"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  statusDetail: {
    type: String,
    default: "Activo",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  typeInscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeInscription",
    required: true,
  },
  amount: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inscription = mongoose.model("Inscription", inscriptionSchema);
export default Inscription;
