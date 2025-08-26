import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getMunicipalities(context) {
  try {
    const res = await api.get("/api/municipalities");
    context.commit("setMunicipalities", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getSimplifiedMunicipalities(context) {
  try {
    const res = await api.get("/api/municipalities/simple");
    context.commit("setMunicipalitiesSimplified", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getStates(context) {
  try {
    const res = await api.get("/api/locations?populate=municipality");
    context.commit("setStates", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getLocationsByMunicipality(context, { skipAdminPrivileges = false } = {}) {
  try {
    const res = await api.get("/api/locations/by-municipality", {
      params: { skipAdminPrivileges }
    });

    const simplifiedLocations = res.data

    context.commit("setLocationsSimplified", simplifiedLocations);

    return res.data;
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getGroupedStates(context) {
  try {
    const res = await api.get("/api/locations/grouped/municipality");
    context.commit("setGroupedStates", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getMunicipalitiesPublic(context) {
  try {
    const res = await api.get("/api/public/data");
    context.commit("setMunicipalities", res.data.municipalities);
  } catch (error) {
    console.error("error :>> ", error);
    Notify.create({
      position: "top-right",
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function tempMunicipality(context, payload) {
  context.commit("setTempMunicipality", payload);
}

export async function createMunicipality(context, payload) {
  const { title } = payload;
  const { location } = payload;
  if (!!title && !!location) {
    try {
      const res = await api.post("/api/municipalities", {
        data: { title, location }
      });
      context.commit("addMunicipality", res.data.data);
      Notify.create({
        message: "Verwaltungsbereich erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getMunicipalities");
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

// createState
export async function createState(context, payload) {
  const { title, municipality } = payload;
  if (!!title && !!municipality) {
    try {
      const res = await api.post("/api/locations", {
        data: { title, municipality: municipality.id }
      });
      // context.commit("addState", res.data);
      Notify.create({
        message: "Geminde erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getStates");
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

export async function editMunicipality(context, payload) {
  const { id } = payload;
  const { title } = payload;
  const { location } = payload;
  if (!!id && !!title && !!location) {
    try {
      const res = await api.put(`/api/municipalities/${id}`, {
        data: { title, location, updatedAt: new Date().toISOString() }
      });
      console.log("res :>> ", res);
      context.commit("editMunicipality", res.data.data);
      Notify.create({
        message: "Verwaltungsbereich erfolgreich aktualisiert",
        type: "positive"
      });
      context.dispatch("getMunicipalities");
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

export async function editState(context, payload) {
  const { id } = payload;
  const { title } = payload;
  const { municipality } = payload;
  if (!!id && !!title && !!municipality) {
    try {
      const res = await api.put(`/api/locations/${id}`, {
        data: { title, municipality, updatedAt: new Date().toISOString() }
      });
      // context.commit("editState", res.data.data);
      Notify.create({
        message: "Bundesland erfolgreich aktualisiert",
        type: "positive"
      });
      context.dispatch("getStates");
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

export async function delteMunicipality(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/municipalities/${id}`);
      context.commit("deleteMunicipality", res.data.data && res.data.data.id);
      Notify.create({
        message: "Verwaltungsbereich erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getMunicipalities");
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

export async function deleteState(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/locations/${id}`);
      context.commit("deleteState", res.data.data && res.data.data.id);
      Notify.create({
        message: "Bundesland erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getStates");
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
