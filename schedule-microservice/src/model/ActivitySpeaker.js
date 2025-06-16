import mongoose from "mongoose";

// Schema para la relación Many-to-Many entre Actividades y Expositores
const activitySpeakerSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: [true, "El ID de la actividad es requerido"],
  },
  speakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Speaker",
    required: [true, "El ID del expositor es requerido"],
  },
  role: {
    type: String,
    enum: {
      values: ["main_speaker", "co_speaker", "moderator", "panelist"],
      message:
        "El rol debe ser: main_speaker, co_speaker, moderator o panelist",
    },
    required: [true, "El rol es requerido"],
  },
  speakerOrder: {
    type: Number,
    default: 1,
    min: [1, "El orden debe ser mayor a 0"],
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice compuesto para evitar duplicados
activitySpeakerSchema.index({ activityId: 1, speakerId: 1 }, { unique: true });

const ActivitySpeaker = mongoose.model(
  "ActivitySpeaker",
  activitySpeakerSchema
);

export default ActivitySpeaker;
