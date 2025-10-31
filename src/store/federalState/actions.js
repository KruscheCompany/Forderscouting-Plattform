import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getFederalStates(context) {
  try {
    const res = await api.get("/api/federal-states");
    context.commit("setFederalStates", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function createFederalState(context, payload) {
  const { title } = payload;
  if (!!title) {
    try {
      const res = await api.post("/api/federal-states", {
        data: { title }
      });
      Notify.create({
        message: "Bundesland erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getFederalStates");
    } catch (error) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function editFederalState(context, payload) {
  const { id, title } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/federal-states/${id}`, {
        data: { title, updatedAt: new Date().toISOString() }
      });
      Notify.create({
        message: "Bundesland erfolgreich aktualisiert",
        type: "positive"
      });
      context.dispatch("getFederalStates");
    } catch (error) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function deleteFederalState(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/federal-states/${id}`);
      Notify.create({
        message: "Bundesland erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getFederalStates");
    } catch (error) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}
