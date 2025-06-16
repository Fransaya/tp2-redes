import scheduleService from "../services/scheduleService.js";

class ScheduleController {
  // Obtengo programa por ID
  async getScheduleById(req, res, next) {
    try {
      const { scheduleId } = req.query;
      const schedule = await scheduleService.getScheduleById(scheduleId);
      res.status(200).json(schedule);
    } catch (error) {
      next(error);
    }
  }

  // Obtengo los programas de un evento
  async getSchedulesByEventId(req, res, next) {
    try {
      const { eventId } = req.query;
      const schedules = await scheduleService.getSchedulesByEventId(eventId);
      res.status(200).json({ status: true, data: schedules });
    } catch (error) {
      next(error);
    }
  }

  // Creo un nuevo programa
  async createSchedule(req, res, next) {
    try {
      const scheduleData = req.body;
      const newSchedule = await scheduleService.createSchedule(scheduleData);
      res.status(201).json(newSchedule);
    } catch (error) {
      next(error);
    }
  }

  // Actualizo un programa existente
  async updateSchedule(req, res, next) {
    try {
      const { scheduleId } = req.query;
      const updateData = req.body;
      const updatedSchedule = await scheduleService.updateSchedule(
        scheduleId,
        updateData
      );
      res.status(200).json(updatedSchedule);
    } catch (error) {
      next(error);
    }
  }

  // Elimino un programa
  async deleteSchedule(req, res, next) {
    try {
      const { scheduleId } = req.query;
      await scheduleService.deleteSchedule(scheduleId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Publico un programa
  async publishSchedule(req, res, next) {
    try {
      const { scheduleId } = req.query;
      const publishedSchedule = await scheduleService.publishSchedule(
        scheduleId
      );
      res.status(200).json(publishedSchedule);
    } catch (error) {
      next(error);
    }
  }
}

export default new ScheduleController();
