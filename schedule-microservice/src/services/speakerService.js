import Speaker from "../model/Speaker.js";
import ActivitySpeaker from "../model/ActivitySpeaker.js";

class SpeakerService {
  // Obtener expositores por evento y opcionar filtrado por estado
  async getSpeakersByEvent(eventId, status) {
    try {
      const query = { eventId };
      if (status) {
        query.status = status;
      }
      const speakers = await Speaker.find(query).sort({ createdAt: -1 });
      return speakers;
    } catch (error) {
      throw new Error(`Error al obtener los expositores: ${error.message}`);
    }
  }

  // Obtener un expositor por ID
  async getSpeakerById(speakerId) {
    try {
      const speaker = await Speaker.findById(speakerId);
      if (!speaker) {
        throw new Error("Expositor no encontrado");
      }
      return speaker;
    } catch (error) {
      throw new Error(`Error al obtener el expositor: ${error.message}`);
    }
  }

  // Crear un nuevo expositor
  async createSpeaker(speakerData) {
    try {
      const speaker = new Speaker(speakerData);
      await speaker.save();
      return speaker;
    } catch (error) {
      throw new Error(`Error al crear el expositor: ${error.message}`);
    }
  }

  // Actualizar info de un expositor
  async updateSpeaker(speakerId, speakerData) {
    try {
      const speaker = await Speaker.findByIdAndUpdate(speakerId, speakerData, {
        new: true,
        runValidators: true,
      });
      if (!speaker) {
        throw new Error("Expositor no encontrado");
      }
      return speaker;
    } catch (error) {
      throw new Error(`Error al actualizar el expositor: ${error.message}`);
    }
  }

  // Eliminar un expositor
  async deleteSpeaker(speakerId) {
    try {
      // Valda si el expositor tiene alguna actividad asociada
      const activitySpeakers = await ActivitySpeaker.find({ speakerId });
      if (activitySpeakers.length > 0) {
        throw new Error(
          "No se puede eliminar el expositor, tiene actividades asociadas"
        );
      }
      const speaker = await Speaker.findByIdAndDelete(
        { _id: speakerId },
        { new: true }
      );
      if (!speaker) {
        throw new Error("Expositor no encontrado");
      }
      return { status: true, message: "Expositor eliminado correctamente" };
    } catch (error) {
      throw new Error(`Error al eliminar el expositor: ${error.message}`);
    }
  }
}

export default new SpeakerService();
