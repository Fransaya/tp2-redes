import speakerService from "../services/speakerService.js";

class SpeakerController {
  // Obtengo expositores de un event
  async getSpeakersByEvent(req, res, next) {
    const { eventId, status } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: "El ID del evento es requerido" });
    }

    try {
      const speakers = await speakerService.getSpeakersByEvent(eventId, status);
      res.status(200).json(speakers);
    } catch (error) {
      next(error);
    }
  }

  // Obtener un expositor por ID
  async getSpeakerById(req, res, next) {
    const { speakerId } = req.query;

    if (!speakerId) {
      return res
        .status(400)
        .json({ error: "El ID del expositor es requerido" });
    }

    try {
      const speaker = await speakerService.getSpeakerById(speakerId);
      res.status(200).json(speaker);
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo expositor
  async createSpeaker(req, res, next) {
    const speakerData = req.body;

    try {
      const newSpeaker = await speakerService.createSpeaker(speakerData);
      res.status(201).json(newSpeaker);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar info de un expositor
  async updateSpeaker(req, res, next) {
    const { speakerId } = req.query;
    const speakerData = req.body;

    if (!speakerId) {
      return res
        .status(400)
        .json({ error: "El ID del expositor es requerido" });
    }

    try {
      const updatedSpeaker = await speakerService.updateSpeaker(
        speakerId,
        speakerData
      );
      res.status(200).json(updatedSpeaker);
    } catch (error) {
      next(error);
    }
  }

  // Elimino un expositor
  async deleteSpeaker(req, res, next) {
    const { speakerId } = req.query;

    if (!speakerId) {
      return res
        .status(400)
        .json({ error: "El ID del expositor es requerido" });
    }

    try {
      await speakerService.deleteSpeaker(speakerId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new SpeakerController();
