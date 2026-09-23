// Shared by the hierarchy getters (federalState / landkreis / municipality /
// location modules). A relation entry is either a plain id (the landkreis
// module stores its relations that way) or a populated { id } object.
export function relationId(entry) {
  return entry && typeof entry === "object" ? entry.id : entry;
}

export function hasRelation(entries, id) {
  return (entries || []).some((entry) => relationId(entry) === id);
}

// The relation array of the record with the given id, or [] if it isn't loaded.
export function relationsOf(records, id, relation) {
  const record = (records || []).find((r) => r.id === id);
  return record ? record[relation] || [] : [];
}
