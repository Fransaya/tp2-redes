import Inscription from "../model/Inscription.js";
import TypeInscription from "../model/TypeInscription.js";

import axios from "axios";

class InscriptionService {
  // Obtener lista de inscripciones
  async getAllInscriptions() {
    try {
      const inscriptions = await Inscription.find();
      return inscriptions;
    } catch (error) {
      throw new Error("Error al obtener las inscripciones");
    }
  }

  // Obtener lista de inscripciones activas o no canceladas
  async getActiveInscriptions() {
    try {
      const inscriptions = await Inscription.find({
        status: true,
      });
      return inscriptions;
    } catch (error) {
      throw new Error("Error al obtener las inscripciones activas");
    }
  }

  // Obtener lista de inscripciones por estado y evento
  async getInscriptionsByEventAndStatus(eventId, status) {
    try {
      const inscriptions = await Inscription.find({
        event: eventId,
        status: status,
      });
      return inscriptions;
    } catch (error) {
      throw new Error("Error al obtener las inscripciones por evento y estado");
    }
  }

  // Obtener lista de inscripciones por evento
  async getInscriptionsByEvent(eventId) {
    try {
      const inscriptions = await Inscription.find({ event: eventId });
      return inscriptions;
    } catch (error) {
      throw new Error("Error al obtener las inscripciones por evento");
    }
  }

  // Obtener lista de inscripciones por estado
  async getInscriptionsByStatus(status) {
    try {
      const inscriptions = await Inscription.find({ status: status });
      return inscriptions;
    } catch (error) {
      throw new Error("Error al obtener las inscripciones por estado");
    }
  }

  // Obtener lista de inscripciones por tipo de inscripcion
  async getInscriptionsByType(typeInscriptionId) {
    try {
      const inscriptions = await Inscription.find({
        typeInscription: typeInscriptionId,
      });
      return inscriptions;
    } catch (error) {
      throw new Error(
        "Error al obtener las inscripciones por tipo de inscripcion"
      );
    }
  }

  // Obtener inscripcion por id
  async getInscriptionById(inscriptionId) {
    try {
      const inscription = await Inscription.findById(inscriptionId);
      return inscription;
    } catch (error) {
      throw new Error("Error al obtener la inscripcion por id");
    }
  }

  // Registrar inscripcion
  async createInscription(inscriptionData, token) {
    try {
      console.log("Datos de inscripcion:", inscriptionData);

      let event;
      try {
        //1. Validacion de existencia de evento y estado
        event = await axios.get(
          `http://localhost:3002/event/by-id?eventId=${inscriptionData.event}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error al valida evento:", error);
      }
      console.log("Evento encontrado:", event.data);
      if (!event.data) {
        throw new Error("Evento no encontrado");
      }

      // Valido estado de evento que este activo
      if (event.status == "Cancelado") throw new Error("Evento cancelado");

      // 2. Valido existencia de tipo de inscripcion y estado
      const typeSuscription = await TypeInscription.findById(
        inscriptionData.typeInscription
      );
      if (!typeSuscription) {
        throw new Error("Tipo de inscripcion no encontrado");
      }

      if (typeSuscription.status == false)
        throw new Error("Tipo de inscripcion cancelado");

      // 3. Valido capacidad de evento
      const eventCapacity = event.data.capacity;
      if (eventCapacity <= 0) throw new Error("No hay cupos disponibles");

      // 4. Valido si existe una inscripcion con mismos datos asociados
      const existingInscription = await Inscription.findOne({
        event: inscriptionData.event,
        $or: [
          { email: inscriptionData.email },
          { phone: inscriptionData.phone },
        ],
      });

      if (existingInscription) {
        throw new Error("Ya existe una inscripcion con estos datos");
      }

      // 5. Registro de inscripcion
      const newInscription = {
        ...inscriptionData,
        status: "Pendiente",
        typeInscription: typeSuscription,
        event: event,
      };

      const saveInscription = new Inscription(newInscription);
      await saveInscription.save();

      // 6. Actualizo la capacidad del evento
      event.data.capacity -= 1;

      const updateEventCapacity = await axios.put(
        `http://localhost:3002/events/${inscriptionData.event._id}/capacity`,
        {
          capacity: event.data.capacity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Capturo error al actualizar la capacidad del evento
      if (updateEventCapacity.status !== 200) {
        throw new Error("Error al actualizar la capacidad del evento");
      }

      const inscription = new Inscription(newInscription);
      await inscription.save();
      return inscription;
    } catch (error) {
      throw new Error("Error al registrar la inscripcion");
    }
  }

  // Actualizo informacion de inscripcion
  async updateInfoInscription(inscriptionId, inscriptionData, token) {
    try {
      const inscription = await Inscription.findById(inscriptionId);
      if (!inscription) throw new Error("Inscripcion no encontrada");

      // 2. Valido existencia de evento y estado
      const event = await axios.get(
        `http://localhost:3002/events/${inscription.event._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dataEvent = event.data;

      if (!dataEvent) throw new Error("Evento no encontrado");

      // 3. Valido estado de evento que este activo
      if (dataEvent.status == "Cancelado") throw new Error("Evento cancelado");

      // 4. Valido si el evento no paso de la fecha de inicio
      if (dataEvent.startDate < new Date()) {
        throw new Error("El evento ya paso de la fecha de inicio");
      }

      // 4. Valido existencia de tipo de inscripcion y estado en caso de que se actualice
      const typeSuscription = await TypeInscription.findById(
        inscriptionData.typeInscription
      );
      if (!typeSuscription)
        throw new Error("Tipo de inscripcion no encontrado");

      if (typeSuscription.status == false)
        throw new Error("Tipo de inscripcion cancelado");

      // 5. Actualizo la informacion de la inscripcion
      const updateInscription = await Inscription.findByIdAndUpdate(
        inscriptionId,
        {
          ...inscriptionData,
          typeInscription: typeSuscription,
        },
        {
          new: true,
        }
      );

      return updateInscription;
    } catch (error) {
      throw new Error("Error al actualizar la informacion de la inscripcion");
    }
  }

  // Actualizo estado de inscripcion a pendiente
  async updateInscriptionStatusPending(inscriptionId) {
    try {
      const inscription = await Inscription.findById(inscriptionId);
      if (!inscription) throw new Error("Inscripcion no encontrada");

      const updateInscription = await Inscription.findByIdAndUpdate(
        inscriptionId,
        {
          status: true,
          statusDetail: "Pendiente",
        },
        {
          new: true,
        }
      );

      return updateInscription;
    } catch (error) {
      throw new Error("Error al actualizar el estado de la inscripcion");
    }
  }

  // Actualizo estado de inscripcion a confirmado
  async updateInscriptionStatusConfirmed(inscriptionId) {
    try {
      const inscription = await Inscription.findById(inscriptionId);
      if (!inscription) throw new Error("Inscripcion no encontrada");

      const updateInscription = await Inscription.findByIdAndUpdate(
        inscriptionId,
        {
          status: true,
          statusDetail: "Confirmado",
        },
        {
          new: true,
        }
      );

      return updateInscription;
    } catch (error) {
      throw new Error("Error al actualizar el estado de la inscripcion");
    }
  }

  // Actualizo estado de inscripcion a cancelado
  async updateInscriptionStatusCanceled(inscriptionId) {
    try {
      const inscription = await Inscription.findById(inscriptionId);
      if (!inscription) throw new Error("Inscripcion no encontrada");

      const updateInscription = await Inscription.findByIdAndUpdate(
        inscriptionId,
        {
          status: false,
          statusDetail: "Cancelado",
        },
        {
          new: true,
        }
      );

      return updateInscription;
    } catch (error) {
      throw new Error("Error al actualizar el estado de la inscripcion");
    }
  }

  // Eliminar inscripcion
  async deleteInscription(inscriptionId) {
    try {
      const inscription = await Inscription.findById(inscriptionId);
      if (!inscription) throw new Error("Inscripcion no encontrada");

      const deleteInscription = await Inscription.findByIdAndDelete(
        inscriptionId
      );

      return deleteInscription;
    } catch (error) {
      throw new Error("Error al eliminar la inscripcion");
    }
  }
}

export default new InscriptionService();
