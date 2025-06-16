import mongoose from "mongoose";

// Schema para Programa/Agenda
const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del programa es requerido"],
    trim: true,
    maxlength: [200, "El nombre no puede exceder 200 caracteres"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
  },
  eventId: {
    type: String,
    required: [true, "El ID del evento es requerido"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "La fecha de inicio es requerida"],
  },
  endDate: {
    type: Date,
    required: [true, "La fecha de fin es requerida"],
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
    },
  },
  status: {
    type: String,
    enum: {
      values: ["draft", "published", "archived"],
      message: "El estado debe ser: draft, published o archived",
    },
    default: "draft",
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

// Middleware para actualizar updatedAt
scheduleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

// Exportar todos los modelos
export default Schedule;
