export function setLocations(state, payload) {
  state.locations = Array.isArray(payload) ? payload : [];
}
