import { hasRelation } from "../hierarchyHelpers";

// Cross-level getters are id-based and operate on the already-normalized flat
// arrays each module's own action commits - no extra network calls, so they work
// as soon as the relevant get*() actions have been dispatched.

export function landkreiseUnder(state, getters, rootState) {
  return (federalStateId) =>
    (rootState.landkreis.landkreise || []).filter((lk) => hasRelation(lk.federalStates, federalStateId));
}

export function municipalitiesUnderState(state, getters, rootState, rootGetters) {
  return (federalStateId) => {
    const ids = new Set();
    rootGetters["federalState/landkreiseUnder"](federalStateId).forEach((lk) => {
      rootGetters["landkreis/municipalitiesUnder"](lk.id).forEach((m) => ids.add(m.id));
    });
    return [...ids];
  };
}
