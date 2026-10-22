// The picker value when nothing is chosen yet. Every place that starts or
// clears a scope uses this, so they cannot drift apart.
export function emptyScope() {
  return { anchorLevel: "landkreis", anchorId: null };
}

// Turns the scope picker's v-model into the one level field the user
// endpoints expect. A user stores only the anchor (municipality, else
// landkreis); the state and any other derived level are never sent. A guest's
// location and a non-guest's profile town are handled by the dialogs, not here.
export function scopeToUserPayload(scope) {
  const { anchorLevel, anchorId } = scope || {};
  if (!anchorId) return {};
  if (anchorLevel === "municipality") return { municipality: { id: anchorId } };
  if (anchorLevel === "landkreis") return { landkreis: { id: anchorId } };
  return {};
}

// The picker value for a stored user-detail. Older users can carry extra levels
// (a municipality user with landkreis and federal state too); only the anchor
// is read, so saving without changes writes the anchor alone.
export function userDetailToScope(detail) {
  const { municipality, landkreis } = detail || {};
  if (municipality && municipality.id) return { anchorLevel: "municipality", anchorId: municipality.id };
  if (landkreis && landkreis.id) return { anchorLevel: "landkreis", anchorId: landkreis.id };
  return emptyScope();
}

// The picker value for what is currently chosen in its dropdowns. The state
// dropdown is only a filter, so it never becomes the anchor. A leader needs a
// municipality, so a landkreis alone is not an anchor for them.
export function selectionToScope({ landkreisId, municipalityId }, municipalityOnly = false) {
  if (municipalityId) return { anchorLevel: "municipality", anchorId: municipalityId };
  if (municipalityOnly) return { anchorLevel: "municipality", anchorId: null };
  if (landkreisId) return { anchorLevel: "landkreis", anchorId: landkreisId };
  return emptyScope();
}

// After the state or landkreis filter changed, drops the lower choices that no
// longer fit under it. `lookup` supplies the id lists of the Vuex getters.
export function reconcileSelection(selection, changed, lookup) {
  const next = { ...selection };
  if (changed === "federalState" && next.federalStateId) {
    if (next.landkreisId && !lookup.landkreisIdsUnderState(next.federalStateId).includes(next.landkreisId)) {
      next.landkreisId = null;
    }
    if (next.municipalityId && !lookup.municipalityIdsUnderState(next.federalStateId).includes(next.municipalityId)) {
      next.municipalityId = null;
    }
  }
  if (
    changed === "landkreis" &&
    next.landkreisId &&
    next.municipalityId &&
    !lookup.municipalityIdsUnderLandkreis(next.landkreisId).includes(next.municipalityId)
  ) {
    next.municipalityId = null;
  }
  return next;
}

// The state and landkreis filters shown for an anchor. They are display only:
// an admin's own pick wins when it is still a parent, otherwise the first
// derived parent is shown (a municipality in two landkreise has two).
export function filtersForAnchor({ anchorLevel, anchorId }, current, lookup) {
  let landkreisId = current.landkreisId || null;
  const federalStateId = current.federalStateId || null;
  if (anchorLevel === "landkreis" && anchorId) {
    landkreisId = anchorId;
  } else if (anchorLevel === "municipality" && anchorId) {
    const parents = lookup.landkreiseOfMunicipality(anchorId);
    if (!parents.includes(landkreisId)) {
      const inState = parents.filter(
        id => !federalStateId || lookup.federalStatesOfLandkreis(id).includes(federalStateId)
      );
      landkreisId = inState.length ? inState[0] : parents[0] || null;
    }
  }
  if (!landkreisId) return { landkreisId: null, federalStateId };
  const states = lookup.federalStatesOfLandkreis(landkreisId);
  return {
    landkreisId,
    federalStateId: states.includes(federalStateId) ? federalStateId : states[0] || null
  };
}

// The title groups of the path line, one group per level. A level holds several
// titles when the chosen municipality or landkreis has several parents.
export function pathGroups({ federalStateId, landkreisId, municipalityId }, lookup) {
  let federalStateIds = federalStateId ? [federalStateId] : [];
  let landkreisIds = [];
  if (municipalityId) {
    landkreisIds = lookup.landkreiseOfMunicipality(municipalityId);
    federalStateIds = lookup.federalStatesOfMunicipality(municipalityId);
  } else if (landkreisId) {
    landkreisIds = [landkreisId];
    federalStateIds = lookup.federalStatesOfLandkreis(landkreisId);
  }
  return [
    federalStateIds.map(id => lookup.title("federalState", id)),
    landkreisIds.map(id => lookup.title("landkreis", id)),
    municipalityId ? [lookup.title("municipality", municipalityId)] : []
  ];
}

export function pathLabel(groups) {
  return groups
    .map(titles => titles.filter(Boolean).join(" / "))
    .filter(Boolean)
    .join(" › ");
}
