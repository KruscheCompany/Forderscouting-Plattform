import { api } from "boot/axios";
import { i18n } from "boot/i18n";

export async function getCategories(context) {
  try {
    const res = await api.get("/api/categories");
    context.commit("setCategories", res.data);
  } catch (error) {
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
  }
}

export async function getSimplifiedCategories(context) {
  try {
    const res = await api.get("/api/category/simple");
    context.commit("setCategoriesSimplified", res.data);
  } catch (error) {
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: error.response.data.error.message },
        { root: true }
      );
    return false;
  }
}

export async function addCategory(context, payload) {
  const { name } = payload;
  if (!!name) {
    try {
      const res = await api.post("/api/categories", { data: { title: name } });
      context.commit("addCategory", res.data.data);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Kategorie erfolgreich hinzugefügt") },
        { root: true }
      );
      context.dispatch("getCategories");
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

export async function editCategory(context, payload) {
  const { id } = payload;
  const { title } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/categories/${id}`, {
        data: { title: title, updatedAt: new Date().toISOString() }
      });
      context.commit("editCategory", res.data.data);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Kategorie erfolgreich geändert") },
        { root: true }
      );
      context.dispatch("getCategories");
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

export async function deleteCategory(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/categories/${id}`);
      context.commit("deleteCategory", res.data.data && res.data.data.id);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Kategorie erfolgreich gelöscht") },
        { root: true }
      );
      context.dispatch("getCategories");
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
