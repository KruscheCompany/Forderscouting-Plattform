// The picker value when nothing is chosen yet. Every place that starts or
// clears a scope uses this, so they cannot drift apart.
export function emptyScope() {
  return { anchorLevel: "landkreis", anchorId: null, levels: null };
}

// Turns the scope picker's v-model into the level fields the user endpoints
// expect. Every chosen level is sent, not just the anchor, because the backend
// stores all of them and clears the ones that are missing.
export function scopeToUserPayload(scope) {
  const { anchorLevel, anchorId, levels } = scope || {};
  const chosen = levels || {
    federalStateId: null,
    landkreisId: anchorLevel === "landkreis" ? anchorId : null,
    municipalityId: anchorLevel === "municipality" ? anchorId : null,
    locationId: anchorLevel === "location" ? anchorId : null,
  };
  const relations = {
    federalState: chosen.federalStateId,
    landkreis: chosen.landkreisId,
    municipality: chosen.municipalityId,
    assignedLocation: chosen.locationId,
  };
  return Object.fromEntries(
    Object.entries(relations)
      .filter(([, id]) => id)
      .map(([field, id]) => [field, { id }])
  );
}

// The picker value for a stored user-detail: its most specific level is the
// anchor and all stored levels ride along.
export function userDetailToScope(detail) {
  const levels = {
    federalStateId: detail.federalState ? detail.federalState.id : null,
    landkreisId: detail.landkreis ? detail.landkreis.id : null,
    municipalityId: detail.municipality ? detail.municipality.id : null,
    locationId: detail.assignedLocation ? detail.assignedLocation.id : null,
  };
  if (levels.locationId) return { anchorLevel: "location", anchorId: levels.locationId, levels };
  if (levels.municipalityId) return { anchorLevel: "municipality", anchorId: levels.municipalityId, levels };
  return { anchorLevel: "landkreis", anchorId: levels.landkreisId, levels };
}
