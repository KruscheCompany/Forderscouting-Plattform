// All three cross-level getters below are id-based and operate on the
// already-normalized flat arrays each module's own action commits - no extra
// network calls, so they work as soon as the relevant get*() actions have
// been dispatched (typically once, app-wide, same as today).

export function landkreiseUnder(state, getters, rootState) {
  return (federalStateId) =>
    (rootState.landkreis.landkreise || []).filter((lk) =>
      (lk.federalStates || []).includes(federalStateId)
    );
}

export function municipalitiesUnder(state, getters, rootState) {
  return (federalStateId) =>
    (rootState.municipality.municipalities || []).filter((m) =>
      (m.federalStates || []).some((fs) => (fs.id || fs) === federalStateId)
    );
}
