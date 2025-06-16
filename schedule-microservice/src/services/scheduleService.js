import Schedule from "../model/Schedule.js";
import Activity from "../model/Activity.js";
import Conflict from "../model/Conflict.js";

class ScheduleService {
  // Obtengo un schedule por su ID
  async getScheduleById(scheduleId) {
    try {
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        throw new Error("Programa no encontrado");
      }
      return schedule;
    } catch (error) {
      throw new Error(`Error al obtener el programa: ${error.message}`);
    }
  }

  // Obtener todos los programas de un evento especifico
  async getSchedulesByEventId(eventId) {
    try {
      const schedules = await Schedule.find({ eventId });
      return schedules;
    } catch (error) {
      throw new Error(`Error al obtener los programas: ${error.message}`);
    }
  }

  // crear un nuevo programa para un evento
  async createSchedule(scheduleData) {
    try {
      const schedule = new Schedule(scheduleData);
      await schedule.save();
      return schedule;
    } catch (error) {
      throw new Error(`Error al crear el programa: ${error.message}`);
    }
  }

  // Actualizar un programa existente
  async updateSchedule(scheduleId, updateData) {
    try {
      const schedule = await Schedule.findByIdAndUpdate(
        scheduleId,
        updateData,
        { new: true, runValidators: true }
      );
      if (!schedule) {
        throw new Error("Programa no encontrado");
      }
      return schedule;
    } catch (error) {
      throw new Error(`Error al actualizar el programa: ${error.message}`);
    }
  }

  // Eliminar un programa
  async deleteSchedule(scheduleId) {
    try {
      // Valido que no exista una actividad asociada al programa
      const activityExist = await Activity.findOne({ scheduleId });
      if (activityExist) {
        throw new Error(
          "No se puede eliminar el programa porque tiene actividades asociadas"
        );
      }

      const schedule = await Schedule.findByIdAndDelete(scheduleId);
      if (!schedule) {
        throw new Error("Programa no encontrado");
      }
      return { message: "Programa eliminado exitosamente" };
    } catch (error) {
      throw new Error(`Error al eliminar el programa: ${error.message}`);
    }
  }

  // Publica un programa
  async publishedSchedule(scheduleId) {
    try {
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        throw new Error("Programa no encontrado");
      }

      if (schedule.status === "archived") {
        throw new Error("El programa está archivado y no puede ser publicado");
      }

      if (schedule.status !== "draft") {
        throw new Error(
          "El programa debe estar en estado 'draft' para ser publicado"
        );
      }

      // Valido que al menos tenga una actividad asociada
      const activities = await Activity.find({ scheduleId });
      if (activities.length === 0) {
        throw new Error(
          "El programa debe tener al menos una actividad para ser publicado"
        );
      }

      // Valido que no tenga conflictos asociados el evento del programa
      const conflicts = await Conflict.find({ eventId: schedule.eventId });
      if (conflicts.length > 0) {
        throw new Error(
          "El programa no puede ser publicado debido a conflictos detectados"
        );
      }

      if (schedule.status === "published") {
        throw new Error("El programa ya está publicado");
      }
      schedule.status = "published";
      await schedule.save();

      return schedule;
    } catch (error) {
      throw new Error(`Error al publicar el programa: ${error.message}`);
    }
  }
}

export default new ScheduleService();
