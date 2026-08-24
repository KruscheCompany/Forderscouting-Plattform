export function setLoading(state, payload) {
  state.loading = payload;
}

export function SET_MAINTENANCE(state, payload) {
  state.maintenanceEnabled = !!(payload && payload.enabled);
  state.maintenanceMessage = (payload && payload.message) || "";
  state.maintenanceScheduledStart = (payload && payload.scheduledStart) || null;
}
