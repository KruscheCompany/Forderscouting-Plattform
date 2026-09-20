import { api } from "boot/axios";
import { i18n } from "boot/i18n";

// Ort/location, split out of the municipality module the same way landkreis
// historically was - the municipality module's `states` (used by the
// States.vue admin page/CreateDialog, misleadingly named after Bundesland
// even though it manages Location/Ort rows) predates this and is left
// untouched for now; new code should read from here instead.
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
