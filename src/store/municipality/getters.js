export function parentFederalStates(state) {
  return (municipalityId) => {
    const municipality = (state.municipalities || []).find((m) => m.id === municipalityId);
    return municipality ? (municipality.federalStates || []) : [];
  };
}

export function parentLandkreise(state) {
  return (municipalityId) => {
    const municipality = (state.municipalities || []).find((m) => m.id === municipalityId);
    return municipality ? (municipality.landkreise || []) : [];
  };
}

export function locationsUnder(state, getters, rootState) {
  return (municipalityId) =>
    (rootState.location.locations || []).filter((loc) => {
      const parentId = (loc.municipality && loc.municipality.id) || loc.municipality;
      return parentId === municipalityId;
    });
}
