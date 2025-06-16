import Conflict from "../model/Conflict.js";

class ConflictService {
  // Obtiene conflictos detectados por evento y filtrado opcional por status y gravedad
  async getConflictsByEvent(eventId, status, severity) {
    try {
      if (!eventId) {
        throw new Error("El ID del evento es requerido");
      }

      const query = { eventId };
      if (status) query.status = status;
      if (severity) query.severity = severity;

      /**
       * El método .populate() en Mongoose (una biblioteca de MongoDB para Node.js) se utiliza para reemplazar los IDs de referencia en tus documentos por los documentos completos a los que hacen referencia.
       */
      const conflicts = await Conflict.find(query)
        .populate("eventId")
        .populate("speakerId");

      return conflicts;
    } catch (error) {
      throw new Error("Error al obtener los conflictos: " + error.message);
    }
  }

  // Obtener un conflicto por su ID
  async getConflictById(conflictId) {
    try {
      const conflict = await Conflict.findById(conflictId)
        .populate("eventId")
        .populate("speakerId");
      if (!conflict) {
        throw new Error("Conflicto no encontrado");
      }
      return conflict;
    } catch (error) {
      throw new Error("Error al obtener el conflicto: " + error.message);
    }
  }

  // Registra un nuevo conflicto
  async createConflict(conflictData) {
    try {
      const conflict = new Conflict(conflictData);
      await conflict.save();
      return conflict;
    } catch (error) {
      throw new Error("Error al crear el conflicto: " + error.message);
    }
  }

  // Actualiza un conflicto como resuelto
  async resolveConflict(conflictId, resolutionData) {
    try {
      const conflict = await Conflict.findByIdAndUpdate(
        conflictId,
        { status: "resolved", resolution: resolutionData },
        { new: true }
      );
    } catch (error) {
      throw new Error("Error al resolver el conflicto: " + error.message);
    }
  }

  // Marcar un conflicto como ignorado
  async ignoreConflict(conflictId) {
    try {
      const conflict = await Conflict.findByIdAndUpdate(
        conflictId,
        { status: "ignored" },
        { new: true }
      );
      if (!conflict) {
        throw new Error("Conflicto no encontrado");
      }
      return conflict;
    } catch (error) {
      throw new Error("Error al ignorar el conflicto: " + error.message);
    }
  }
}

export default new ConflictService();
