import { pathLabel } from "components/hierarchy/scopePayload";

// A non-guest's profile Ort must lie in their own scope; the API rejects
// anything else. A guest's location is their scope and cannot be changed.
export function ortOptions(locations, userDetails, isGuest = false) {
  if (isGuest) return [];
  const allowed = userDetails?.resolved?.locationIds || [];
  return (locations || []).filter(location => allowed.includes(location.id));
}

export function personalDataPayload(form, isGuest) {
  const payload = {
    fullName: form.fullName,
    phone: form.telephone,
    location: form.assignedLocation?.title || "",
    streetNo: form.streetNo,
    postalCode: form.postalCode,
    contactPrivacy: form.contactPrivacy
  };
  if (!isGuest) {
    payload.assignedLocation = form.assignedLocation?.id ? { id: form.assignedLocation.id } : null;
  }
  return payload;
}

export function profilePathLabel(userDetails) {
  const resolved = userDetails?.resolved;
  if (!resolved) return "";
  const titles = records => (records || []).map(record => record.title);
  return pathLabel([
    titles(resolved.federalStates),
    titles(resolved.landkreise),
    resolved.municipality ? [resolved.municipality.title] : []
  ]);
}
