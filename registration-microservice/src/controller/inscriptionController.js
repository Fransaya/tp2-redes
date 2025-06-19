import inscriptionService from "../services/inscriptionService.js";

class InscriptionController {
  // Obtener todas las inscripciones
  async getAllInscriptions(req, res, next) {
    try {
      const inscriptions = await inscriptionService.getAllInscriptions();
      res.status(200).json(inscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtener inscripciones activas
  async getActiveInscriptions(req, res, next) {
    try {
      const inscriptions = await inscriptionService.getActiveInscriptions();
      res.status(200).json(inscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtengo inscripcion por id
  async getInscriptionById(req, res, next) {
    const { inscriptionId } = req.query;

    try {
      const inscription = await inscriptionService.getInscriptionById(
        inscriptionId
      );
      if (!inscription) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
      res.status(200).json(inscription);
    } catch (error) {
      next(error);
    }
  }

  // Obtener inscripcion por evento
  async getInscriptionsByEvent(req, res, next) {
    const { eventId } = req.query;
    try {
      const inscriptions = await inscriptionService.getInscriptionsByEvent(
        eventId
      );
      if (!inscriptions || inscriptions.length === 0) {
        return res.status(404).json({
          message: "No se encontraron inscripciones para este evento",
        });
      }
      res.status(200).json(inscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtener inscripcion por tipo de inscripcion
  async getInscriptionsByType(req, res, next) {
    const { typeInscriptionId } = req.query;
    try {
      const inscriptions = await inscriptionService.getInscriptionsByType(
        typeInscriptionId
      );
      if (!inscriptions || inscriptions.length === 0) {
        return res.status(404).json({
          message: "No se encontraron inscripciones para este tipo",
        });
      }
      res.status(200).json(inscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtener inscripcion por estado
  async getInscriptionsByStatus(req, res, next) {
    const { status } = req.query;
    try {
      const inscriptions = await inscriptionService.getInscriptionsByStatus(
        status
      );
      if (!inscriptions || inscriptions.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron inscripciones con este estado" });
      }
      res.status(200).json(inscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtener inscripciones por evento y estado
  async getInscriptionsByEventAndStatus(req, res, next) {
    const { eventId, status } = req.query;
    try {
      const inscriptions =
        await inscriptionService.getInscriptionsByEventAndStatus(
          eventId,
          status
        );
      if (!inscriptions || inscriptions.length === 0) {
        return res.status(404).json({
          message: "No se encontraron inscripciones para este evento y estado",
        });
      }
      res.status(200).json(inscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Registrar nueva inscripcion
  async createInscription(req, res, next) {
    const body = req.body;

    //! obtener token de header Authorization
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
      const newInscription = await inscriptionService.createInscription(
        body,
        token
      );
      res.status(201).json(newInscription);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar informacion de inscripcion
  async updateInfoInscription(req, res, next) {
    const { inscriptionId } = req.query;
    const body = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    try {
      const updatedInscription = await inscriptionService.updateInfoInscription(
        inscriptionId,
        body,
        token
      );
      if (!updatedInscription) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
      res.status(200).json(updatedInscription);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar estado de inscripcion
  // 1- actualizar estado a pendiente
  async updateStatusInscriptionPending(req, res, next) {
    const { inscriptionId } = req.query;

    try {
      const updatedInscription =
        await inscriptionService.updateInscriptionStatusPending(inscriptionId);
      if (!updatedInscription) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
      res.status(200).json(updatedInscription);
    } catch (error) {
      next(error);
    }
  }

  // 2. actualizar estado a confirmado
  async updateStatusInscriptionConfirmed(req, res, next) {
    const { inscriptionId } = req.query;

    try {
      const updatedInscription =
        await inscriptionService.updateInscriptionStatusConfirmed(
          inscriptionId
        );
      if (!updatedInscription) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
      res.status(200).json(updatedInscription);
    } catch (error) {
      next(error);
    }
  }

  // 3. actualizar estado a cancelado
  async updateStatusInscriptionCanceled(req, res, next) {
    const { inscriptionId } = req.query;

    try {
      const updatedInscription =
        await inscriptionService.updateInscriptionStatusCanceled(inscriptionId);
      if (!updatedInscription) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
      res.status(200).json(updatedInscription);
    } catch (error) {
      next(error);
    }
  }

  // Eliminar inscripcion
  async deleteInscription(req, res, next) {
    const { inscriptionId } = req.query;

    try {
      const deletedInscription = await inscriptionService.deleteInscription(
        inscriptionId
      );
      if (!deletedInscription) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
      res.status(200).json({ message: "Inscripción eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

export default new InscriptionController();
