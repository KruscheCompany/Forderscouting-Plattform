import { api } from "boot/axios";
import { Notify } from "quasar";

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
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function createLandkreis(context, payload) {
  const { title, federalStates, municipalities } = payload;
  if (!!title) {
    try {
      const res = await api.post("/api/landkreise", {
        data: { title, federalStates, municipalities }
      });
      Notify.create({
        message: "Landkreis erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getLandkreise");
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

export async function editLandkreis(context, payload) {
  const { id, title, federalStates, municipalities } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/landkreise/${id}`, {
        data: { title, federalStates, municipalities, updatedAt: new Date().toISOString() }
      });
      Notify.create({
        message: "Landkreis erfolgreich aktualisiert",
        type: "positive"
      });
      context.dispatch("getLandkreise");
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

export async function deleteLandkreis(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/landkreise/${id}`);
      Notify.create({
        message: "Landkreis erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getLandkreise");
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
