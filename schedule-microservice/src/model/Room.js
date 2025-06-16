import mongoose from "mongoose";

// Schema para Salas
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre de la sala es requerido"],
    trim: true,
    maxlength: [100, "El nombre no puede exceder 100 caracteres"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "La descripción no puede exceder 500 caracteres"],
  },
  eventId: {
    type: String,
    required: [true, "El ID del evento es requerido"],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, "La capacidad es requerida"],
    min: [1, "La capacidad debe ser mayor a 0"],
    max: [10000, "La capacidad no puede exceder 10000"],
  },
  location: {
    type: String,
    required: [true, "La ubicación es requerida"],
    trim: true,
    maxlength: [200, "La ubicación no puede exceder 200 caracteres"],
  },
  accessibility: {
    type: Boolean,
    default: false,
  },
  floor: {
    type: String,
    trim: true,
    maxlength: [50, "El piso no puede exceder 50 caracteres"],
  },
  building: {
    type: String,
    trim: true,
    maxlength: [100, "El edificio no puede exceder 100 caracteres"],
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive", "maintenance"],
      message: "El estado debe ser: active, inactive o maintenance",
    },
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

roomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
