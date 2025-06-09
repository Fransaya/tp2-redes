import mongoose from "mongoose";

// Esquema de ubicacion del evento
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título del evento es requerido"],
      trim: true,
      maxlength: [100, "El título no puede exceder 100 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripción del evento es requerida"],
      trim: true,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    startDate: {
      type: Date,
      required: [true, "La fecha del evento es requerida"],
    },
    endDate: {
      type: Date,
      required: [true, "La fecha de finalización del evento es requerida"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message:
          "La fecha de finalización debe ser posterior a la fecha de inicio",
      },
    },
    location: {
      name: {
        type: String,
        required: [true, "El nombre de la ubicación es requerido"],
        trim: true,
        maxlength: [
          100,
          "El nombre de la ubicación no puede exceder 100 caracteres",
        ],
      },
      address: {
        type: String,
        required: [true, "La dirección de la ubicación es requerida"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "La ciudad de la ubicación es requerida"],
        trim: true,
      },
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad de la ubicación es requerida"],
      min: [1, "La capacidad debe ser al menos 1"],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID del organizador es requerido"],
    },
    pricing: {
      type: {
        type: String,
        enum: ["free", "paid"],
        required: [true, "El tipo de precio es requerido"],
      },
      price: {
        type: Number,
        required: function () {
          return this.pricing.type === "paid";
        },
        min: [0, "El precio no puede ser negativo"],
      },
    },
    status: {
      type: String,
      default: "Planificación",
      enum: [
        "Planificación",
        "Activo",
        "Finalizado",
        "Cancelado",
        "Postergado",
      ],
      required: [true, "El estado del evento es requerido"],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
