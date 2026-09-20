import { api } from "boot/axios";
import { i18n } from "boot/i18n";

export async function getFederalStates(context) {
  try {
    const res = await api.get("/api/federal-states");
    // Default core controller (no custom find() override), so the response is
    // Strapi's raw REST envelope ({data:[{id,attributes:{...}}], meta}) - flatten
    // it here, once, so every consumer reads plain {id,title} objects, matching
    // the landkreis/municipality modules' already-normalized shape.
    const raw = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];
    const federalStates = raw.map(entry => {
      const attrs = entry.attributes || entry;
      return { id: entry.id, title: attrs.title };
    });
    context.commit("setFederalStates", federalStates);
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
  }
}

export async function createFederalState(context, payload) {
  const { title } = payload;
  if (!!title) {
    try {
      const res = await api.post("/api/federal-states", {
        data: { title }
      });
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Bundesland erfolgreich hinzugefügt") },
        { root: true }
      );
      context.dispatch("getFederalStates");
    } catch (error) {
      context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
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
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Bundesland erfolgreich aktualisiert") },
        { root: true }
      );
      context.dispatch("getFederalStates");
    } catch (error) {
      context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
      return false;
    }
  }
}

export async function deleteFederalState(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/federal-states/${id}`);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Bundesland erfolgreich gelöscht") },
        { root: true }
      );
      context.dispatch("getFederalStates");
    } catch (error) {
      context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
      return false;
    }
  }
}
