import activitySpeakerService from "../services/activitySpeakerService.js";

class ActivitySpeakerController {
  // Asignar expositor a una actividad
  assignSpeakerToActivity(req, res, next) {
    try {
      const activitySpeakerData = req.body;
      const activitySpeaker =
        activitySpeakerService.assignSpeakerToActivity(activitySpeakerData);
      res.status(201).json({
        message: "Speaker assigned to activity successfully",
        data: activitySpeaker,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar expositor de una actividad
  removeSpeakerFromActivity(req, res, next) {
    try {
      const { activityId, speakerId } = req.query;
      const result = activitySpeakerService.removeSpeakerFromActivity(
        activityId,
        speakerId
      );
      res.status(200).json({
        message: "Speaker removed from activity successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivitySpeakerController();
