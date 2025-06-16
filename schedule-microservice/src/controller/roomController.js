import roomService from "../services/roomService.js";

class RoomController {
  // Obtengo salas de un evento por su id ( opcionalmente por estado )
  async getRoomsByEventId(req, res) {
    try {
      const { eventId, status } = req.query;
      const rooms = await roomService.getRoomsByEventId(eventId, status);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtengo una sala por su id
  async getRoomById(req, res) {
    try {
      const { roomId } = req.query;
      const room = await roomService.getRoomById(roomId);
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Valido disponibilidad de una sala en fecha especifica
  async isRoomAvailable(req, res) {
    try {
      const { roomId, startTime, endTime } = req.query;
      const isAvailable = await roomService.isRoomAvailable(
        roomId,
        startTime,
        endTime
      );
      res.status(200).json({ available: isAvailable });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Creo y registro una nueva sala
  async createRoom(req, res) {
    try {
      const roomData = req.body;
      const newRoom = await roomService.createRoom(roomData);
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizo una sala por su id
  async updateRoom(req, res) {
    try {
      const { roomId } = req.query;
      const roomData = req.body;
      const updatedRoom = await roomService.updateRoom(roomId, roomData);
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Elimino una sala por su id
  async deleteRoom(req, res) {
    try {
      const { roomId } = req.query;
      await roomService.deleteRoom(roomId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RoomController();
