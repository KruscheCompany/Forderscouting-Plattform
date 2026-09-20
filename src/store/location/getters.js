// Defensive array return (not a single object) even though location.municipality
// is currently a 1:1 relation on the backend - keeps this getter's contract
// stable if that ever becomes m:n like the other levels.
export function parentMunicipality(state) {
  return (locationId) => {
    const location = (state.locations || []).find((l) => l.id === locationId);
    if (!location || !location.municipality) return [];
    return [location.municipality];
  };
}
