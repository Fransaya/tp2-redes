import typeInscriptionService from "../services/typeInscriptionService.js";

class TypeInscriptionController {
  // Obtener todos los tipos de inscripciones
  async getAllTypeInscriptions(req, res, next) {
    try {
      const typeInscriptions =
        await typeInscriptionService.getAllTypeInscriptions();
      res.status(200).json(typeInscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtener tipos de inscripciones activas
  async getActiveTypeInscriptions(req, res, next) {
    try {
      const typeInscriptions =
        await typeInscriptionService.getActiveTypeInscriptions();
      res.status(200).json(typeInscriptions);
    } catch (error) {
      next(error);
    }
  }

  // Obtener tipo de inscripción por ID
  async getTypeInscriptionById(req, res, next) {
    const { typeInscriptionId } = req.query;

    try {
      const typeInscription =
        await typeInscriptionService.getTypeInscriptionById(typeInscriptionId);
      if (!typeInscription) {
        return res
          .status(404)
          .json({ message: "Tipo de inscripción no encontrado" });
      }
      res.status(200).json(typeInscription);
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo tipo de inscripción
  async createTypeInscription(req, res, next) {
    const typeInscriptionData = req.body;

    try {
      const newTypeInscription =
        await typeInscriptionService.createTypeInscription(typeInscriptionData);
      res.status(201).json(newTypeInscription);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar un tipo de inscripción
  async updateTypeInscription(req, res, next) {
    const { typeInscriptionId } = req.query;
    const typeInscriptionData = req.body;

    try {
      const updatedTypeInscription =
        await typeInscriptionService.updateTypeInscription(
          typeInscriptionId,
          typeInscriptionData
        );
      if (!updatedTypeInscription) {
        return res
          .status(404)
          .json({ message: "Tipo de inscripción no encontrado" });
      }
      res.status(200).json(updatedTypeInscription);
    } catch (error) {
      next(error);
    }
  }

  // Activar un tipo de inscripción
  async activateTypeInscription(req, res, next) {
    const { typeInscriptionId } = req.query;

    try {
      const activatedTypeInscription =
        await typeInscriptionService.activateTypeInscription(typeInscriptionId);
      if (!activatedTypeInscription) {
        return res
          .status(404)
          .json({ message: "Tipo de inscripción no encontrado" });
      }
      res.status(200).json(activatedTypeInscription);
    } catch (error) {
      next(error);
    }
  }

  // Desactivar un tipo de inscripción
  async deactivateTypeInscription(req, res, next) {
    const { typeInscriptionId } = req.query;

    try {
      const deactivatedTypeInscription =
        await typeInscriptionService.deactivateTypeInscription(
          typeInscriptionId
        );
      if (!deactivatedTypeInscription) {
        return res
          .status(404)
          .json({ message: "Tipo de inscripción no encontrado" });
      }
      res.status(200).json(deactivatedTypeInscription);
    } catch (error) {
      next(error);
    }
  }
}

export default new TypeInscriptionController();
