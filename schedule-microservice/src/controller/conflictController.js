import conflictService from "../services/conflictService.js";

class ConflictController {
  // Obtener conflictos por evento, y filtrados opcionalmente por estado o gravedad
  async getConflictsByEvent(req, res) {
    const { eventId, status, severity } = req.query;
    if (!eventId) {
      return res.status(400).json({ message: "El ID del evento es requerido" });
    }
    if (
      status &&
      !["detected", "acknowledged", "resolved", "ignored"].includes(status)
    ) {
      return res.status(400).json({ message: "Estado inválido" });
    }
    if (severity && !["low", "medium", "high", "critical"].includes(severity)) {
      return res.status(400).json({ message: "Severidad inválida" });
    }
    try {
      const conflicts = await conflictService.getConflictsByEvent(
        eventId,
        status,
        severity
      );
      res.status(200).json(conflicts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener conflicto por ID
  async getConflictById(req, res) {
    const { conflictId } = req.query;
    if (!conflictId) {
      return res
        .status(400)
        .json({ message: "El ID del conflicto es requerido" });
    }
    try {
      const conflict = await conflictService.getConflictById(conflictId);
      res.status(200).json(conflict);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Registrar un nuevo conflicto
  async createConflict(req, res) {
    const conflictData = req.body;
    if (!conflictData.eventId || !conflictData.type || !conflictData.severity) {
      return res.status(400).json({
        message:
          "eventId, type y severity son requeridos para crear un conflicto",
      });
    }
    try {
      const conflict = await conflictService.createConflict(conflictData);
      res.status(201).json(conflict);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Actualizar un conflicto como resuelto
  async resolveConflict(req, res) {
    const { conflictId } = req.query;
    const resolutionData = req.body;
    if (!conflictId) {
      return res
        .status(400)
        .json({ message: "El ID del conflicto es requerido" });
    }
    try {
      const conflict = await conflictService.resolveConflict(
        conflictId,
        resolutionData
      );
      res.status(200).json(conflict);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Ignorar un conflicto
  async ignoreConflict(req, res) {
    const { conflictId } = req.query;
    if (!conflictId) {
      return res
        .status(400)
        .json({ message: "El ID del conflicto es requerido" });
    }
    try {
      const conflict = await conflictService.ignoreConflict(conflictId);
      res.status(200).json(conflict);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ConflictController();
