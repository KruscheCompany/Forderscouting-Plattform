import { hasRelation } from "../hierarchyHelpers";

// Cross-level getters are id-based and operate on the already-normalized flat
// arrays each module's own action commits - no extra network calls, so they work
// as soon as the relevant get*() actions have been dispatched.

export function landkreiseUnder(state, getters, rootState) {
  return (federalStateId) =>
    (rootState.landkreis.landkreise || []).filter((lk) => hasRelation(lk.federalStates, federalStateId));
}
