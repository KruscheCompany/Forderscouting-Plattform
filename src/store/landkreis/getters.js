export function federalStatesOf(state, getters, rootState) {
  return (landkreisId) => {
    const landkreis = (state.landkreise || []).find((lk) => lk.id === landkreisId);
    if (!landkreis) return [];
    // landkreis.federalStates is already a plain id array (see landkreis/actions.js) -
    // a landkreis can span more than one (M:N, not a strict tree).
    return (rootState.federalState.federalStates || []).filter((fs) =>
      (landkreis.federalStates || []).includes(fs.id)
    );
  };
}

export function municipalitiesUnder(state, getters, rootState) {
  return (landkreisId) => {
    const landkreis = (state.landkreise || []).find((lk) => lk.id === landkreisId);
    if (!landkreis) return [];
    // landkreis.municipalities is a plain id array (see landkreis/actions.js) -
    // resolve to full {id,title} objects from the municipality module.
    return (rootState.municipality.municipalities || []).filter((m) =>
      (landkreis.municipalities || []).includes(m.id)
    );
  };
}
