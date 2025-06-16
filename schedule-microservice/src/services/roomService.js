import Room from "../model/Room.js";
import Activity from "../model/Activity.js";

class RoomService {
  // Obtener todas las salas de un evento
  async getRoomsByEventId(eventId, status) {
    try {
      if (status && !["active", "inactive", "maintenance"].includes(status)) {
        throw new Error(
          "Invalid status provided. Valid statuses are: active, inactive, maintenance."
        );
      }
      const query = { eventId };
      if (status) {
        query.status = status;
      }
      // Buscar salas por eventId y opcionalmente por status
      if (!eventId) {
        throw new Error("Event ID is required to fetch rooms.");
      }

      const rooms = await Room.find({ query }).sort({ createdAt: -1 });
      return rooms;
    } catch (error) {
      throw new Error(
        `Error fetching rooms for event ${eventId}: ${error.message}`
      );
    }
  }

  // Obtener una sala por su ID
  async getRoomById(roomId) {
    try {
      if (!roomId) {
        throw new Error("Room ID is required to fetch a room.");
      }
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error(`Room with ID ${roomId} not found.`);
      }
      return room;
    } catch (error) {
      throw new Error(
        `Error fetching room with ID ${roomId}: ${error.message}`
      );
    }
  }

  // Verifica disponibilidad de una sala en fecha especifica
  async isRoomAvailable(roomId, startTime, endTime) {
    try {
      if (!roomId || !startTime || !endTime) {
        throw new Error(
          "Room ID, start time, and end time are required to check availability."
        );
      }

      const activities = await Activity.find({
        roomId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });

      return activities.length === 0; // Si no hay actividades, la sala está disponible
    } catch (error) {
      throw new Error(
        `Error checking availability for room with ID ${roomId}: ${error.message}`
      );
    }
  }

  // Crea una nueva sala
  async createRoom(roomData) {
    try {
      const newRoom = new Room(roomData);
      await newRoom.save();
      return newRoom;
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  // Actualiza una sala existente
  async updateRoom(roomId, roomData) {
    try {
      if (!roomId) {
        throw new Error("Room ID is required to update a room.");
      }

      const activityAsociated = await Activity.findOne({ roomId });

      // Valido que la capacidad de la sala actualizada no sea menor que la capacidad que tenga asociada las actividades de esa sala
      if (activityAsociated.capacity < roomData.capacity) {
        throw new Error(
          `Cannot update room capacity to ${roomData.capacity} as it exceeds the capacity of associated activities.`
        );
      }

      const updatedRoom = await Room.findByIdAndUpdate(roomId, roomData, {
        new: true,
        runValidators: true,
      });
      if (!updatedRoom) {
        throw new Error(`Room with ID ${roomId} not found.`);
      }
      return updatedRoom;
    } catch (error) {
      throw new Error(
        `Error updating room with ID ${roomId}: ${error.message}`
      );
    }
  }

  // Elimino una sala
  async deleteRoom(roomId) {
    try {
      if (!roomId) {
        throw new Error("Room ID is required to delete a room.");
      }

      // Verifico si la sala tiene actividades asociadas
      const activities = await Activity.find({ roomId });
      if (activities.length > 0) {
        throw new Error(
          `Cannot delete room with ID ${roomId} because it has associated activities.`
        );
      }

      const deletedRoom = await Room.findByIdAndDelete(roomId);
      if (!deletedRoom) {
        throw new Error(`Room with ID ${roomId} not found.`);
      }
      return deletedRoom;
    } catch (error) {
      throw new Error(
        `Error deleting room with ID ${roomId}: ${error.message}`
      );
    }
  }
}

export default new RoomService();
