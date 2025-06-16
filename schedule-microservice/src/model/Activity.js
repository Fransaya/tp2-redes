import mongoose from "mongoose";

// Schema para Actividades/Sesiones
const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título de la actividad es requerido"],
    trim: true,
    maxlength: [200, "El título no puede exceder 200 caracteres"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, "La descripción no puede exceder 2000 caracteres"],
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: [true, "El ID del programa es requerido"],
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "El ID de la sala es requerido"],
  },
  type: {
    type: String,
    enum: {
      values: ["keynote", "workshop", "panel", "break", "networking", "lunch"],
      message:
        "El tipo debe ser: keynote, workshop, panel, break, networking o lunch",
    },
    required: [true, "El tipo de actividad es requerido"],
  },
  startTime: {
    type: Date,
    required: [true, "La hora de inicio es requerida"],
  },
  endTime: {
    type: Date,
    required: [true, "La hora de fin es requerida"],
    validate: {
      validator: function (value) {
        return value > this.startTime;
      },
      message: "La hora de fin debe ser posterior a la hora de inicio",
    },
  },
  capacity: {
    type: Number,
    min: [1, "La capacidad debe ser mayor a 0"],
    max: [10000, "La capacidad no puede exceder 10000"],
  },
  registrationRequired: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
      maxlength: [50, "Cada etiqueta no puede exceder 50 caracteres"],
    },
  ],
  status: {
    type: String,
    enum: {
      values: ["scheduled", "confirmed", "cancelled", "completed"],
      message:
        "El estado debe ser: scheduled, confirmed, cancelled o completed",
    },
    default: "scheduled",
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

// Middleware para calcular duración automáticamente
activitySchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // en minutos
  }
  this.updatedAt = Date.now();
  next();
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
