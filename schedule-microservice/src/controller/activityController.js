import activityService from "../services/activityService.js";

class activityController {
  // Obtengo todas las actividades filtradas (scheduleId, roomId, status, date, type)
  async getActivities(req, res) {
    try {
      const { scheduleId, roomId, status, date, type } = req.query;
      const filter = {
        scheduleId: scheduleId || undefined,
        roomId: roomId || undefined,
        status: status || undefined,
        date: date ? new Date(date) : undefined,
        type: type || undefined,
      };

      const activities = await activityService.getActivities(filter);
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities", error });
    }
  }

  // Obtengo una actividad por su ID
  async getActivityById(req, res) {
    try {
      const { activityId } = req.params;
      const activity = await activityService.getActivityById(activityId);
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activity", error });
    }
  }

  // Creo una nueva actividad
  async createActivity(req, res) {
    try {
      const activity = await activityService.createActivity(req.body);
      console.log("Activity created:", activity);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Error creating activity", error });
    }
  }

  // Modifico una actividad existente
  async updateActivity(req, res) {
    try {
      const { activityId } = req.query;
      if (!activityId) {
        return res.status(400).json({ message: "Activity ID is required" });
      }
      const activityData = req.body;
      if (!activityData || Object.keys(activityData).length === 0) {
        return res.status(400).json({ message: "No data provided for update" });
      }
      const updatedActivity = await activityService.updateActivity(
        activityId,
        activityData
      );
      res.status(200).json(updatedActivity);
    } catch (error) {
      res.status(500).json({ message: "Error updating activity", error });
    }
  }

  // Elimino una actividad
  async deleteActivity(req, res) {
    try {
      const { activityId } = req.query;
      if (!activityId) {
        return res.status(400).json({ message: "Activity ID is required" });
      }
      const result = await activityService.deleteActivity(activityId);
      res
        .status(200)
        .json({ message: "Activity deleted successfully", result });
    } catch (error) {
      res.status(500).json({ message: "Error deleting activity", error });
    }
  }
}

export default new activityController();
