import { api } from "boot/axios";
import { i18n } from "boot/i18n";

// The single cache of Ort/location rows - the admin Locations page, its
// create/edit dialog and every location picker all read it. The municipality
// module's location create/update/delete actions refresh it after saving.
export async function getLocations(context) {
  try {
    const res = await api.get("/api/locations");
    context.commit("setLocations", res.data);
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
      "notifications/pushToast",
      { kind: "negative", title: i18n.t(error.response.data.error.message) },
      { root: true }
    );
  }
}

// Scoped fetch for when the parent municipality is already known - avoids
// loading the full location list just to filter it client-side.
export async function getLocationsUnder(context, { municipalityId }) {
  try {
    const res = await api.get("/api/locations/by-municipality", {
      params: { municipalityId }
    });
    return res.data;
  } catch (error) {
    console.error("error :>> ", error);
    context.dispatch(
      "notifications/pushToast",
      { kind: "negative", title: i18n.t(error.response.data.error.message) },
      { root: true }
    );
    return [];
  }
}
