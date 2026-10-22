import { relationId } from "src/store/hierarchyHelpers";

// Getters return either id arrays or record arrays depending on the module.
const idsOf = (entries) => (entries || []).map(relationId);

function municipalityIdsUnderStates(stateIds, getters) {
  const ids = new Set();
  stateIds.forEach((stateId) => {
    idsOf(getters["federalState/municipalitiesUnderState"](stateId)).forEach((id) => ids.add(id));
  });
  return ids;
}

function landkreisIdsUnderStates(stateIds, getters) {
  const ids = new Set();
  stateIds.forEach((stateId) => {
    idsOf(getters["federalState/landkreiseUnder"](stateId)).forEach((id) => ids.add(id));
  });
  return ids;
}

export function municipalityOptions({ stateIds, landkreisIds, getters, municipalities }) {
  if (!stateIds.length) return [];

  let allowed;
  if (landkreisIds.length) {
    allowed = new Set();
    landkreisIds.forEach((landkreisId) => {
      idsOf(getters["landkreis/municipalitiesUnder"](landkreisId)).forEach((id) => allowed.add(id));
    });
  } else {
    allowed = municipalityIdsUnderStates(stateIds, getters);
  }

  return (municipalities || [])
    .filter((m) => allowed.has(m.id))
    .sort((a, b) => a.title.localeCompare(b.title));
}

// Selected Landkreise / municipalities that no longer lie under any selected state.
export function pruneSelection({ stateIds, landkreisIds, municipalityIds, getters }) {
  const validLandkreise = landkreisIdsUnderStates(stateIds, getters);
  const validMunicipalities = municipalityIdsUnderStates(stateIds, getters);
  return {
    landkreisIds: landkreisIds.filter((id) => validLandkreise.has(id)),
    municipalityIds: municipalityIds.filter((id) => validMunicipalities.has(id))
  };
}
