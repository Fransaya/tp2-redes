import mongoose from "mongoose";

// Schema para Expositores
const speakerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "El ID del usuario es requerido"],
    trim: true,
  },
  eventId: {
    type: String,
    required: [true, "El ID del evento es requerido"],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [2000, "La biografía no puede exceder 2000 caracteres"],
  },
  position: {
    type: String,
    trim: true,
    maxlength: [200, "El cargo no puede exceder 200 caracteres"],
  },
  expertise: [
    {
      type: String,
      trim: true,
      maxlength: [100, "Cada expertise no puede exceder 100 caracteres"],
    },
  ],
  status: {
    type: String,
    enum: {
      values: ["pending", "confirmed", "cancelled"],
      message: "El estado debe ser: pending, confirmed o cancelled",
    },
    default: "pending",
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

speakerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Índice compuesto para evitar duplicados
speakerSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Speaker = mongoose.model("Speaker", speakerSchema);

export default Speaker;
