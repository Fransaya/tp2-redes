import mongoose from "mongoose";

const typeInscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "El nombre no puede exceder 100 caracteres"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, "La descripción no puede exceder 500 caracteres"],
  },
  price: {
    type: Number,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const TypeInscription = mongoose.model(
  "TypeInscription",
  typeInscriptionSchema
);
export default TypeInscription;
