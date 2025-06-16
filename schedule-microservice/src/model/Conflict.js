import mongoose from "mongoose";

// Schema para Conflictos de Programación
const conflictSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: [true, "El ID del evento es requerido"],
    trim: true,
  },
  type: {
    type: String,
    enum: {
      values: [
        "room_overlap",
        "speaker_overlap",
        "capacity_exceeded",
        "time_conflict",
      ],
      message:
        "El tipo debe ser: room_overlap, speaker_overlap, capacity_exceeded o time_conflict",
    },
    required: [true, "El tipo de conflicto es requerido"],
  },
  severity: {
    type: String,
    enum: {
      values: ["low", "medium", "high", "critical"],
      message: "La severidad debe ser: low, medium, high o critical",
    },
    required: [true, "La severidad es requerida"],
  },
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
    trim: true,
    maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
  },
  affectedActivities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  affectedRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  affectedSpeakers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    },
  ],
  status: {
    type: String,
    enum: {
      values: ["detected", "acknowledged", "resolved", "ignored"],
      message: "El estado debe ser: detected, acknowledged, resolved o ignored",
    },
    default: "detected",
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: [1000, "La resolución no puede exceder 1000 caracteres"],
  },
  detectedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
});

// Middleware para establecer resolvedAt cuando se resuelve
conflictSchema.pre("save", function (next) {
  if (this.status === "resolved" && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  next();
});

const Conflict = mongoose.model("Conflict", conflictSchema);

export default Conflict;
