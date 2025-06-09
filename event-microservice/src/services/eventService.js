import Event from "../model/Event.js";

class EventSerivce {
  // Obtener lista de eventos
  async getEvents() {
    try {
      const events = await Event.find();
      return events;
    } catch (error) {
      throw new Error("Error al obtener los eventos");
    }
  }

  // Obtener lista de eventos activos
  async getActiveEvents() {
    try {
      const activeEvents = await Event.find({ status: true });
      return activeEvents;
    } catch (error) {
      throw new Error("Error al obtener los eventos activos");
    }
  }

  // Obtener lista de eventos por fecha de inicio o fin
  async getEventsByDate(startDate, endDate) {
    try {
      const query = {};

      if (startDate) query.startDate = { $gte: new Date(startDate) };

      if (endDate) query.endDate = { $lte: new Date(endDate) };

      const events = await Event.find(query);
      return events;
    } catch (error) {
      throw new Error("Error al obtener eventos por fecha: " + error.message);
    }
  }

  // Crear evento
  async createEvent(eventData) {
    try {
      const event = new Event(eventData);
      await event.save();
      return event;
    } catch (error) {
      throw new Error("Error al crear el evento: " + error.message);
    }
  }

  // Actualizar informacion evento
  async updateInfoEvent(eventId, eventDate) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { $set: eventDate },
        { new: true, runValidators: true }
      );
      if (!event) {
        throw new Error("Evento no encontrado");
      }

      return event;
    } catch (error) {
      throw new Error(
        "Error al actualizar la información del evento: " + error.message
      );
    }
  }

  // Modificar fechas evento
  async updateEventDates(eventId, startDate, endDate) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { startDate: new Date(startDate), endDate: new Date(endDate) },
        { new: true, runValidators: true }
      );
      if (!event) {
        throw new Error("Evento no encontrado");
      }

      return event;
    } catch (error) {
      throw new Error(
        "Error al actualizar las fechas del evento: " + error.message
      );
    }
  }

  // Modificar ubicacion evento
  async updateEventLocation(eventId, location) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { location: location },
        { new: true, runValidators: true }
      );
      if (!event) {
        throw new Error("Evento no encontrado");
      }
      return event;
    } catch (error) {
      throw new Error(
        "Error al actualizar la ubicación del evento: " + error.message
      );
    }
  }

  // Modificar capacidad evento
  async updateCapacityEvent(eventId, capacity) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { location: capacity },
        { new: true, runValidators: true }
      );
      if (!event) {
        throw new Error("Evento no encontrado");
      }

      return event;
    } catch (error) {
      throw new Error(
        "Error al actualizar la capacidad del evento: " + error.message
      );
    }
  }

  // Actualizar estado del evento
  async updateStatusEvent(eventId, status) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { status: status },
        { new: true, runValidators: true }
      );
      if (!event) {
        throw new Error("Evento no encontrado");
      }

      return event;
    } catch (error) {
      throw new Error(
        "Error al actualizar el estado del evento: " + error.message
      );
    }
  }
}

export default new EventSerivce();
