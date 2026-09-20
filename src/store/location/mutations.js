export function setLocations(state, payload) {
  state.locations = Array.isArray(payload) ? payload : [];
}

export function deleteLocation(state, id) {
  if (id) state.locations = state.locations.filter((location) => location.id !== id);
}
