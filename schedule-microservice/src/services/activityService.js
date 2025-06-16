import Activity from "../model/Activity.js";
import Room from "../model/Room.js";

// Servicio de habitaciones
import roomService from "./roomService.js";

class ActivityService {
  // Obtener todas las actividades filtradas ( scheduleId, roomId, status, date, type )
  async getActivities({ scheduleId, roomId, status, date, type }) {
    try {
      const query = {};

      if (scheduleId) {
        query.scheduleId = scheduleId;
      }
      if (roomId) {
        query.roomId = roomId;
      }
      if (status) {
        query.status = status;
      }
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.startTime = { $gte: startOfDay, $lte: endOfDay };
      }
      if (type) {
        query.type = type;
      }

      const activities = await Activity.find(query).sort({ startTime: 1 });
      return activities;
    } catch (error) {
      throw new Error(`Error fetching activities: ${error.message}`);
    }
  }

  // Obtener una actividad por su ID
  async getActivityById(activityId) {
    try {
      if (!activityId) {
        throw new Error("Activity ID is required to fetch an activity.");
      }
      const activity = await Activity.findById(activityId);
      if (!activity) {
        throw new Error(`Activity with ID ${activityId} not found.`);
      }
      return activity;
    } catch (error) {
      throw new Error(
        `Error fetching activity with ID ${activityId}: ${error.message}`
      );
    }
  }

  // Crear una nueva actividad
  async createActivity(activityData) {
    try {
      if (!activityData.scheduleId || !activityData.roomId) {
        throw new Error(
          "Schedule ID and Room ID are required to create an activity."
        );
      }

      // Validar que la sala existe
      const isRoomAvailable = await Room.findOne({
        _id: activityData.roomId,
      });

      if (isRoomAvailable) {
        throw new Error("The room is not available for the specified time.");
      }

      // Valido capacidad de la habitacion
      if (isRoomAvailable.capacity < activityData.capacity) {
        throw new Error(
          "The room does not have enough capacity for this activity."
        );
      }

      // Validar la disponibilidad de horas de la sala
      const availableRoom = await roomService.isRoomAvailable(
        activityData.roomId,
        activityData.startTime,
        activityData.endTime
      );
      if (!availableRoom) {
        throw new Error("The room is not available for the specified time.");
      }

      // Crear la actividad
      const newActivity = new Activity(activityData);
      await newActivity.save();
      return newActivity;
    } catch (error) {
      throw new Error(`Error creating activity: ${error.message}`);
    }
  }

  // Actualizar una actividad existente
  async updateActivity(activityId, activityData) {
    try {
      if (!activityId) {
        throw new Error("Activity ID is required to update an activity.");
      }

      // Validar que la actividad existe
      const existingActivity = await Activity.findById(activityId);
      if (!existingActivity) {
        throw new Error(`Activity with ID ${activityId} not found.`);
      }

      // Validar la disponibilidad de horas de la sala
      const availableRoom = await roomService.isRoomAvailable(
        activityData.roomId,
        activityData.startTime,
        activityData.endTime
      );
      if (!availableRoom) {
        throw new Error("The room is not available for the specified time.");
      }

      // Actualizar la actividad
      const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        activityData,
        { new: true }
      );
      return updatedActivity;
    } catch (error) {
      throw new Error(`Error updating activity: ${error.message}`);
    }
  }

  // Eliminar una actividad por su ID
  async deleteActivity(activityId) {
    try {
      if (!activityId) {
        throw new Error("Activity ID is required to delete an activity.");
      }

      const deletedActivity = await Activity.findByIdAndDelete(activityId);
      if (!deletedActivity) {
        throw new Error(`Activity with ID ${activityId} not found.`);
      }
      return deletedActivity;
    } catch (error) {
      throw new Error(`Error deleting activity: ${error.message}`);
    }
  }
}

export default new ActivityService();
