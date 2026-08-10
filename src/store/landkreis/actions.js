import { api } from "boot/axios";
import { i18n } from "boot/i18n";

export async function getLandkreise(context) {
  try {
    const res = await api.get("/api/landkreise?populate=federalStates,municipalities");
    const raw = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];
    const landkreise = raw.map(entry => {
      const attrs = entry.attributes || entry;
      const toIds = (relation) => {
        if (relation && Array.isArray(relation.data)) return relation.data.map(r => r.id);
        if (Array.isArray(relation)) return relation.map(r => (r && r.id) || r);
        return [];
      };
      return {
        id: entry.id,
        title: attrs.title,
        federalStates: toIds(attrs.federalStates),
        municipalities: toIds(attrs.municipalities)
      };
    });
    context.commit("setLandkreise", landkreise);
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
  }
}

export async function createLandkreis(context, payload) {
  const { title, federalStates, municipalities } = payload;
  if (!!title) {
    try {
      const res = await api.post("/api/landkreise", {
        data: { title, federalStates, municipalities }
      });
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Landkreis erfolgreich hinzugefügt") },
        { root: true }
      );
      context.dispatch("getLandkreise");
    } catch (error) {
      context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
      return false;
    }
  }
}

export async function editLandkreis(context, payload) {
  const { id, title, federalStates, municipalities } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/landkreise/${id}`, {
        data: { title, federalStates, municipalities, updatedAt: new Date().toISOString() }
      });
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Landkreis erfolgreich aktualisiert") },
        { root: true }
      );
      context.dispatch("getLandkreise");
    } catch (error) {
      context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
      return false;
    }
  }
}

export async function deleteLandkreis(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/landkreise/${id}`);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Landkreis erfolgreich gelöscht") },
        { root: true }
      );
      context.dispatch("getLandkreise");
    } catch (error) {
      context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
      return false;
    }
  }
}
