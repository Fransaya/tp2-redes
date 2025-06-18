import axios from "axios";
import TypeInscription from "../model/TypeInscription.js";

class TypeInscriptionService {
  // Obtener lista de tipos de inscripción ( activa o inactiva )
  async getAllTypeInscriptions() {
    try {
      const typeInscriptions = await TypeInscription.find();
      return typeInscriptions;
    } catch (error) {
      throw new Error("Error al obtener los tipos de inscripción");
    }
  }

  // Obtener tipo de inscripcipon activa
  async getActiveTypeInscriptions() {
    try {
      const typeInscriptions = await TypeInscription.find({ status: true });
      return typeInscriptions;
    } catch (error) {
      throw new Error("Error al obtener los tipos de inscripción activos");
    }
  }

  // Obtener tipo de inscripción por id
  async getTypeInscriptionById(typeInscriptionId) {
    try {
      const typeInscription = await TypeInscription.findById(typeInscriptionId);
      if (!typeInscription) {
        throw new Error("Tipo de inscripción no encontrado");
      }
      return typeInscription;
    } catch (error) {
      throw new Error("Error al obtener el tipo de inscripción por ID");
    }
  }

  // Crear un nuevo tipo de inscripción
  async createTypeInscription(typeInscriptionData) {
    try {
      const newTypeInscription = new TypeInscription(typeInscriptionData);
      await newTypeInscription.save();
      return newTypeInscription;
    } catch (error) {
      console.error("Error al crear el tipo de inscripción:", error);
      throw new Error("Error al crear el tipo de inscripción");
    }
  }

  // Actualizar un tipo de inscripción
  async updateTypeInscription(typeInscriptionId, typeInscriptionData) {
    try {
      const updatedTypeInscription = await TypeInscription.findByIdAndUpdate(
        typeInscriptionId,
        typeInscriptionData,
        { new: true }
      );
      if (!updatedTypeInscription) {
        throw new Error("Tipo de inscripción no encontrado");
      }
      return updatedTypeInscription;
    } catch (error) {
      throw new Error("Error al actualizar el tipo de inscripción");
    }
  }

  // Activar un tipo de inscripción
  async activateTypeInscription(typeInscriptionId) {
    try {
      const activatedTypeInscription = await TypeInscription.findByIdAndUpdate(
        typeInscriptionId,
        { status: true },
        { new: true }
      );
      if (!activatedTypeInscription) {
        throw new Error("Tipo de inscripción no encontrado");
      }
      return activatedTypeInscription;
    } catch (error) {
      throw new Error("Error al activar el tipo de inscripción");
    }
  }

  // Desactivar un tipo de inscripción
  async deactivateTypeInscription(typeInscriptionId) {
    try {
      const deactivatedTypeInscription =
        await TypeInscription.findByIdAndUpdate(
          typeInscriptionId,
          { status: false },
          { new: true }
        );
      if (!deactivatedTypeInscription) {
        throw new Error("Tipo de inscripción no encontrado");
      }
      return deactivatedTypeInscription;
    } catch (error) {
      throw new Error("Error al desactivar el tipo de inscripción");
    }
  }
}

export default new TypeInscriptionService();
