import { relationId, relationsOf } from "../hierarchyHelpers";

export function parentLandkreise(state) {
  return (municipalityId) => relationsOf(state.municipalities, municipalityId, "landkreise");
}

// Union over all parent landkreise - a municipality can sit in several landkreise
// across federal states, so never pick just one.
export function federalStatesOfMunicipality(state, getters, rootState, rootGetters) {
  return (municipalityId) => {
    const ids = new Set();
    rootGetters["municipality/parentLandkreise"](municipalityId).forEach((entry) => {
      rootGetters["landkreis/federalStatesOf"](relationId(entry)).forEach((fs) => ids.add(fs.id));
    });
    return [...ids];
  };
}
