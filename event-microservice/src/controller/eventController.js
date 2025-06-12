import eventService from "../services/eventService.js";

class EventController {
  // Obtener lista de eventos
  async getEvents(req, res, next) {
    const { id } = req.query;

    try {
      const events = await eventService.getEvents();
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  // Obtener evento por id
  async getEventId(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.eventId);
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  }

  // Obtener lista de eventos activos
  async getActiveEvents(req, res, next) {
    try {
      const activeEvents = await eventService.getActiveEvents();
      res.status(200).json(activeEvents);
    } catch (error) {
      next(error);
    }
  }

  // Obtener lista de eventos por fecha de inicio o fin
  async getEventsByDate(req, res, next) {
    const { startDate, endDate } = req.query;
    try {
      const events = await eventService.getEventsByDate(startDate, endDate);
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  // Crear evento
  async createEvent(req, res, next) {
    try {
      const eventData = req.body;
      const event = await eventService.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar informacion evento
  async updateInfoEvent(req, res, next) {
    const { eventId } = req.params;
    const eventData = req.body;
    try {
      const updatedEvent = await eventService.updateInfoEvent(
        eventId,
        eventData
      );
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }

  // Modificar fechas de evento
  async updateEventDates(req, res, next) {
    const eventId = req.params.eventId;
    const { startDate, endDate } = req.body;

    const eventData = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    try {
      const updatedEvent = await eventService.updateEventDates(
        eventId,
        eventData
      );
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }

  // Modificar ubicacion del evento
  async updateEventLocation(req, res, next) {
    const eventId = req.params.eventId;
    const { location } = req.body;

    try {
      const updatedEvent = await eventService.updateEventLocation(
        eventId,
        location
      );
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }

  // Modifificar capacidad del evento
  async updateEventCapacity(req, res, next) {
    const eventId = req.params.eventId;
    const { capacity } = req.body;

    try {
      const updatedEvent = await eventService.updateEventCapacity(
        eventId,
        capacity
      );
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar el estado del evento
  async updateEventStatus(req, res) {
    const { eventId } = req.params;
    const { status } = req.body;

    try {
      const updatedEvent = await eventService.updateEventStatus(
        eventId,
        status
      );
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new EventController();
