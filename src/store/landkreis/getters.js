import { hasRelation, relationsOf } from "../hierarchyHelpers";

// landkreis.federalStates / landkreis.municipalities are plain id arrays (see
// landkreis/actions.js), resolved here to the full objects of the other module.
// A landkreis can span more than one federal state (M:N, not a strict tree).
export function federalStatesOf(state, getters, rootState) {
  return (landkreisId) => {
    const ids = relationsOf(state.landkreise, landkreisId, "federalStates");
    return (rootState.federalState.federalStates || []).filter((fs) => hasRelation(ids, fs.id));
  };
}

export function municipalitiesUnder(state, getters, rootState) {
  return (landkreisId) => {
    const ids = relationsOf(state.landkreise, landkreisId, "municipalities");
    return (rootState.municipality.municipalities || []).filter((m) => hasRelation(ids, m.id));
  };
}
