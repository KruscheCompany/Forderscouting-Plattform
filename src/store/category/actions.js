import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getCategories(context) {
  try {
    const res = await api.get("/api/categories");
    context.commit("setCategories", res.data);
  } catch (error) {
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getSimplifiedCategories(context) {
  try {
    const res = await api.get("/api/category/simple");
    context.commit("setCategoriesSimplified", res.data);
  } catch (error) {
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
    return false;
  }
}

export async function addCategory(context, payload) {
  const { name } = payload;
  if (!!name) {
    try {
      const res = await api.post("/api/categories", { data: { title: name } });
      context.commit("addCategory", res.data.data);
      Notify.create({
        message: "Kategorie erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getCategories");
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

export async function editCategory(context, payload) {
  const { id } = payload;
  const { title } = payload;
  if (!!id && !!title) {
    try {
      const res = await api.put(`/api/categories/${id}`, {
        data: { title: title, updatedAt: new Date().toISOString() }
      });
      context.commit("editCategory", res.data.data);
      Notify.create({
        message: "Kategorie erfolgreich geändert",
        type: "positive"
      });
      context.dispatch("getCategories");
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

export async function deleteCategory(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/categories/${id}`);
      context.commit("deleteCategory", res.data.data && res.data.data.id);
      Notify.create({
        message: "Kategorie erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getCategories");
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
