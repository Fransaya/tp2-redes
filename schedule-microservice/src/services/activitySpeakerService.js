import Activity from "../model/Activity.js";
import ActivitySpeaker from "../model/ActivitySpeaker.js";
import Speaker from "../model/Speaker.js";
import Conflict from "../model/Conflict.js";

class ActivitySpeakerService {
  // Asigna un expositor a actividad
  async assignSpeakerToActivity(activitySpeakerData) {
    try {
      const activity = await Activity.findById(activitySpeakerData.activityId);
      if (!activity) {
        throw new Error("Activity not found");
      }

      const speaker = await Speaker.findById(activitySpeakerData.speakerId);
      if (!speaker) {
        throw new Error("Speaker not found");
      }

      // Verifico que expositor no tenga conflictos de horario
      const conflictSpeaker = await Conflict.findOne({
        affectedSpeakers: activitySpeakerData.speakerId,
        status: { $ne: "resolved" },
      });

      if (conflictSpeaker) {
        throw new Error(
          `Speaker has a conflict: ${conflictSpeaker.description}`
        );
      }

      // Verifico que no haya otro expositor con rol main_speaker
      const existMainSpeaker = await ActivitySpeaker.findOne({
        activityId: activitySpeakerData.activityId,
        role: "main_speaker",
      });

      if (existMainSpeaker && activitySpeakerData.role === "main_speaker") {
        throw new Error(
          "An activity can only have one main speaker. Please choose a different role."
        );
      }

      // Guardo el expositor en la actividad
      const activitySpeaker = new ActivitySpeaker(activitySpeakerData);
      await activitySpeaker.save();
      // Actualizo el estado de la actividad si es necesario
      if (activity.status === "scheduled") {
        activity.status = "confirmed";
        await activity.save();
      }
      // Actualizo el estado del expositor
      speaker.status = "confirmed";
      await speaker.save();
      // Retorno el expositor asignado
      return activitySpeaker;
    } catch (error) {
      throw new Error(`Error assigning speaker to activity: ${error.message}`);
    }
  }

  // Elimino expositor de actividad
  async removeSpeakerFromActivity(activityId, speakerId) {
    try {
      const activitySpeaker = await ActivitySpeaker.findOneAndDelete({
        activityId,
        speakerId,
      });

      if (!activitySpeaker) {
        throw new Error("ActivitySpeaker not found");
      }

      // Verifico si la actividad tiene otros expositores
      const remainingSpeakers = await ActivitySpeaker.find({ activityId });
      if (remainingSpeakers.length === 0) {
        // si no quedan expositores cambio a estado cancelado
        const activity = await Activity.findById(activityId);
        if (activity) {
          activity.status = "cancelled";
          await activity.save();
        }
      }

      return activitySpeaker;
    } catch (error) {
      throw new Error(`Error removing speaker from activity: ${error.message}`);
    }
  }
}

export default new ActivitySpeakerService();
