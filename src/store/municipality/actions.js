import { api } from "boot/axios";
import { i18n } from "boot/i18n";

export async function getMunicipalities(context) {
  try {
    const res = await api.get("/api/municipalities?populate=federalStates");
    context.commit("setMunicipalities", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
  }
}

export async function getSimplifiedMunicipalities(context) {
  try {
    const res = await api.get("/api/municipalities/simple");
    context.commit("setMunicipalitiesSimplified", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
  }
}

export async function getLocationsByMunicipality(context, { municipalityId }) {
  try {
    const res = await api.get("/api/locations/by-municipality", {
      params: { municipalityId }
    });

    const simplifiedLocations = res.data

    context.commit("setLocationsSimplified", simplifiedLocations);

    return res.data;
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
  }
}

export async function getMunicipalitiesPublic(context) {
  try {
    const res = await api.get("/api/public/data");
    context.commit("setMunicipalities", res.data.municipalities);
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
        "notifications/pushToast",
        { kind: "negative", title: i18n.t(error.response.data.error.message) },
        { root: true }
      );
  }
}

export async function tempMunicipality(context, payload) {
  context.commit("setTempMunicipality", payload);
}

export async function createMunicipality(context, payload) {
  const {
    title, location, federalStates, landkreise,
    financeContactEmail, financeContactFirstName, financeContactLastName,
    personnelContactEmail, personnelContactFirstName, personnelContactLastName
  } = payload;
  if (!!title && !!location) {
    try {
      const res = await api.post("/api/municipalities", {
        data: {
          title,
          verwaltungssitz: location,
          federalStates: federalStates || [],
          landkreise: landkreise || [],
          financeContactEmail: financeContactEmail || null,
          financeContactFirstName: financeContactFirstName || null,
          financeContactLastName: financeContactLastName || null,
          personnelContactEmail: personnelContactEmail || null,
          personnelContactFirstName: personnelContactFirstName || null,
          personnelContactLastName: personnelContactLastName || null
        }
      });
      context.commit("addMunicipality", res.data.data);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Verwaltungsbereich erfolgreich hinzugefügt") },
        { root: true }
      );
      context.dispatch("getMunicipalities");
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

export async function createLocationEntry(context, payload) {
  const { title, municipality, federalStates, landkreise } = payload;
  if (!!title && !!municipality) {
    try {
      const res = await api.post("/api/locations", {
        data: {
          title,
          municipality: municipality.id,
          federalStates: federalStates || [],
          landkreise: landkreise || []
        }
      });
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Ort erfolgreich hinzugefügt") },
        { root: true }
      );
      context.dispatch("location/getLocations", null, { root: true });
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

export async function editMunicipality(context, payload) {
  const {
    id, title, location, federalStates, landkreise,
    financeContactEmail, financeContactFirstName, financeContactLastName,
    personnelContactEmail, personnelContactFirstName, personnelContactLastName
  } = payload;
  if (!!id && !!title && !!location) {
    try {
      const res = await api.put(`/api/municipalities/${id}`, {
        data: {
          title,
          verwaltungssitz: location,
          federalStates: federalStates || [],
          landkreise: landkreise || [],
          financeContactEmail: financeContactEmail || null,
          financeContactFirstName: financeContactFirstName || null,
          financeContactLastName: financeContactLastName || null,
          personnelContactEmail: personnelContactEmail || null,
          personnelContactFirstName: personnelContactFirstName || null,
          personnelContactLastName: personnelContactLastName || null,
          updatedAt: new Date().toISOString()
        }
      });
      console.log("res :>> ", res);
      context.commit("editMunicipality", res.data.data);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Verwaltungsbereich erfolgreich aktualisiert") },
        { root: true }
      );
      context.dispatch("getMunicipalities");
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

export async function editLocationEntry(context, payload) {
  const { id, title, municipality, federalStates, landkreise } = payload;
  if (!!id && !!title && !!municipality) {
    try {
      const res = await api.put(`/api/locations/${id}`, {
        data: {
          title,
          municipality,
          federalStates: federalStates || [],
          landkreise: landkreise || [],
          updatedAt: new Date().toISOString()
        }
      });
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Ort erfolgreich aktualisiert") },
        { root: true }
      );
      context.dispatch("location/getLocations", null, { root: true });
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

export async function delteMunicipality(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/municipalities/${id}`);
      context.commit("deleteMunicipality", res.data.data && res.data.data.id);
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Verwaltungsbereich erfolgreich gelöscht") },
        { root: true }
      );
      context.dispatch("getMunicipalities");
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

export async function deleteLocationEntry(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/locations/${id}`);
      context.commit("location/deleteLocation", res.data.data && res.data.data.id, { root: true });
      context.dispatch(
        "notifications/pushToast",
        { kind: "positive", title: i18n.t("Ort erfolgreich gelöscht") },
        { root: true }
      );
      context.dispatch("location/getLocations", null, { root: true });
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
