import { ortOptions, personalDataPayload, profilePathLabel } from "components/user/settings/profileOrt";

const locations = [
  { id: 1, title: "Rathaus" },
  { id: 2, title: "Bauhof" },
  { id: 3, title: "Schule" }
];

const resolvedFor = locationIds => ({
  federalStates: [{ id: 1, title: "Schleswig-Holstein" }],
  landkreise: [{ id: 10, title: "Nordfriesland" }],
  municipality: { id: 5, title: "VG Fördermittel" },
  locationIds
});

describe("ortOptions", () => {
  it("limits a non-guest to the locations in their resolved scope", () => {
    expect(ortOptions(locations, { resolved: resolvedFor([1, 3]) })).toEqual([locations[0], locations[2]]);
  });

  it("offers every location of a Landkreis user's municipalities", () => {
    const userDetails = {
      landkreis: { id: 10 },
      resolved: { ...resolvedFor([1, 2, 3]), municipality: null }
    };
    expect(ortOptions(locations, userDetails)).toEqual(locations);
  });

  it("offers nothing to a guest", () => {
    expect(ortOptions(locations, { resolved: resolvedFor([1, 2, 3]) }, true)).toEqual([]);
  });

  it("offers nothing while resolved is missing", () => {
    expect(ortOptions(locations, {})).toEqual([]);
    expect(ortOptions(locations, null)).toEqual([]);
  });

  it("tolerates a missing location list", () => {
    expect(ortOptions(undefined, { resolved: resolvedFor([1]) })).toEqual([]);
  });
});

describe("personalDataPayload", () => {
  const form = {
    fullName: "Max",
    telephone: "123",
    assignedLocation: { id: 2, title: "Bauhof" },
    streetNo: "Hauptstr. 1",
    postalCode: "25813",
    contactPrivacy: false
  };

  it("sends neither location nor assignedLocation for a guest", () => {
    const payload = personalDataPayload(form, true, 1);
    expect("assignedLocation" in payload).toBe(false);
    expect("location" in payload).toBe(false);
    expect(payload).toMatchObject({ fullName: "Max", phone: "123", streetNo: "Hauptstr. 1", postalCode: "25813" });
  });

  it("sends no assignedLocation when a non-guest's Ort is unchanged", () => {
    const payload = personalDataPayload(form, false, 2);
    expect("assignedLocation" in payload).toBe(false);
    expect(payload.phone).toBe("123");
  });

  it("sends the new Ort as { id } when a non-guest changed it", () => {
    expect(personalDataPayload(form, false, 1).assignedLocation).toEqual({ id: 2 });
  });

  it("sends the Ort as { id } when a non-guest sets one for the first time", () => {
    expect(personalDataPayload(form, false).assignedLocation).toEqual({ id: 2 });
  });

  it("sends null when a non-guest cleared the Ort", () => {
    const payload = personalDataPayload({ ...form, assignedLocation: null }, false, 2);
    expect(payload.assignedLocation).toBeNull();
    expect(payload.location).toBe("");
  });

  it("sends nothing for an Ort that was empty and stays empty", () => {
    const payload = personalDataPayload({ ...form, assignedLocation: null }, false, null);
    expect("assignedLocation" in payload).toBe(false);
  });
});

describe("profilePathLabel", () => {
  it("joins state, Landkreis and municipality", () => {
    expect(profilePathLabel({ resolved: resolvedFor([]) })).toBe("Schleswig-Holstein › Nordfriesland › VG Fördermittel");
  });

  it("shows every parent of a municipality in two Landkreise", () => {
    const resolved = {
      ...resolvedFor([]),
      federalStates: [{ id: 1, title: "SH" }, { id: 2, title: "RP" }],
      landkreise: [{ id: 10, title: "A" }, { id: 11, title: "B" }]
    };
    expect(profilePathLabel({ resolved })).toBe("SH / RP › A / B › VG Fördermittel");
  });

  it("works for a Landkreis-only user", () => {
    expect(profilePathLabel({ resolved: { ...resolvedFor([]), municipality: null } })).toBe(
      "Schleswig-Holstein › Nordfriesland"
    );
  });

  it("is empty without resolved", () => {
    expect(profilePathLabel({})).toBe("");
    expect(profilePathLabel(null)).toBe("");
  });
});
