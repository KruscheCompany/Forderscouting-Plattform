import { api } from "boot/axios";
import { i18n } from "boot/i18n";

export async function getTags(context) {
  try {
    const res = await api.get("/api/tags");
    context.commit("setTags", res.data);
  } catch (error) {
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
    return false;
  }
}

export async function getSimplifiedTags(context, payload) {
  try {
    const res = await api.get("/api/tags/simple");
    context.commit("setTagsSimplified", res.data);
  } catch (error) {
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
    return false;
  }
}

export async function addTag(context, payload) {
  const { name } = payload;
  if (!!name) {
    try {
      const res = await api.post("/api/tags", { data: { title: name } });
      context.commit("addTag", res.data.data);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Schlagwort erfolgreich hinzugefügt") },
        { root: true }
      );
      context.dispatch("getTags");
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

export async function deleteTag(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/tags/${id}`);
      context.commit("deleteTag", res.data.data && res.data.data.id);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Schlagwort erfolgreich gelöscht") },
        { root: true }
      );
      context.dispatch("getTags");
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

export async function editTag(context, payload) {
  const { id } = payload;
  const { title } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/tags/${id}`, {
        data: { title: title, updatedAt: new Date().toISOString() }
      });
      context.commit("editTag", res.data.data);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Schlagwort erfolgreich geändert") },
        { root: true }
      );
      context.dispatch("getTags");
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
