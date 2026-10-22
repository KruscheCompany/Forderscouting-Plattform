import { pathLabel } from "components/hierarchy/scopePayload";

// A non-guest's profile Ort must lie in their own scope; the API rejects
// anything else. A guest's location is their scope and cannot be changed.
export function ortOptions(locations, userDetails, isGuest = false) {
  if (isGuest) return [];
  const allowed = userDetails?.resolved?.locationIds || [];
  return (locations || []).filter(location => allowed.includes(location.id));
}

// Guests send neither `location` nor `assignedLocation`: both would change
// what the API treats as their scope. A non-guest's Ort is only sent when it
// changed, so an unchanged Ort that has since left their scope cannot make
// an unrelated save fail.
export function personalDataPayload(form, isGuest, storedLocationId = null) {
  const payload = {
    fullName: form.fullName,
    phone: form.telephone,
    streetNo: form.streetNo,
    postalCode: form.postalCode,
    contactPrivacy: form.contactPrivacy
  };
  if (isGuest) return payload;
  payload.location = form.assignedLocation?.title || "";
  const chosenId = form.assignedLocation?.id || null;
  if (chosenId !== (storedLocationId || null)) {
    payload.assignedLocation = chosenId ? { id: chosenId } : null;
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
