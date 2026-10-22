import { hasRelation, relationId } from "src/store/hierarchyHelpers";

// Getters return either id arrays or record arrays depending on the module.
const idsOf = (entries) => (entries || []).map(relationId);

function municipalityIdsUnderStates(stateIds, getters) {
  const ids = new Set();
  stateIds.forEach((stateId) => {
    idsOf(getters["federalState/municipalitiesUnderState"](stateId)).forEach((id) => ids.add(id));
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

// An id is dropped only when the loaded hierarchy positively places it outside
// every selected state; ids with no known parent are kept so a late-loading or
// incomplete store never silently widens a funding's audience.
function placedOutside(parentStateLists, selectedStates) {
  return (
    parentStateLists.length > 0 &&
    parentStateLists.every((states) => states.length > 0 && !states.some((id) => selectedStates.has(id)))
  );
}

export function pruneSelection({ stateIds, landkreisIds, municipalityIds, landkreise }) {
  const selectedStates = new Set(stateIds);
  const records = landkreise || [];
  const stateIdsOf = (lk) => idsOf(lk.federalStates);

  return {
    landkreisIds: landkreisIds.filter((id) => {
      const lk = records.find((r) => r.id === id);
      return !(lk && placedOutside([stateIdsOf(lk)], selectedStates));
    }),
    municipalityIds: municipalityIds.filter((id) => {
      const parents = records.filter((lk) => hasRelation(lk.municipalities, id));
      return !placedOutside(parents.map(stateIdsOf), selectedStates);
    })
  };
}
