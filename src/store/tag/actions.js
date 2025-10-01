import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getTags(context) {
  try {
    const res = await api.get("/api/tags");
    context.commit("setTags", res.data);
  } catch (error) {
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
    return false;
  }
}

export async function getSimplifiedTags(context, payload) {
  try {
    const res = await api.get("/api/tags/simple");
    context.commit("setTagsSimplified", res.data);
  } catch (error) {
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
    return false;
  }
}

export async function addTag(context, payload) {
  const { name } = payload;
  if (!!name) {
    try {
      const res = await api.post("/api/tags", { data: { title: name } });
      context.commit("addTag", res.data.data);
      Notify.create({
        message: "Schlagwort erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getTags");
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

export async function deleteTag(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/tags/${id}`);
      context.commit("deleteTag", res.data.data && res.data.data.id);
      Notify.create({
        message: "Schlagwort erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getTags");
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

export async function editTag(context, payload) {
  const { id } = payload;
  const { title } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/tags/${id}`, {
        data: { title: title, updatedAt: new Date().toISOString() }
      });
      context.commit("editTag", res.data.data);
      Notify.create({
        message: "Schlagwort erfolgreich geändert",
        type: "positive"
      });
      context.dispatch("getTags");
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
