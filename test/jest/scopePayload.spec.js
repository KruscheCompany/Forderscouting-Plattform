import {
  emptyScope,
  scopeToUserPayload,
  userDetailToScope,
  selectionToScope,
  reconcileSelection,
  filtersForAnchor,
  pathGroups,
  pathLabel,
  userToForm
} from "components/hierarchy/scopePayload";

// state 1 <- landkreis 10 <- muni 100; state 2 <- landkreis 20 <- muni 200;
// muni 300 sits in landkreis 10 and 20 (two states); muni 400 has no landkreis.
const titles = {
  federalState: { 1: "Schleswig-Holstein", 2: "Rheinland-Pfalz" },
  landkreis: { 10: "Landkreis A", 20: "Landkreis B" },
  municipality: { 100: "Amt 100", 200: "Amt 200", 300: "Amt 300", 400: "Amt 400" }
};
const landkreiseOfMunicipality = { 100: [10], 200: [20], 300: [10, 20], 400: [] };
const federalStatesOfLandkreis = { 10: [1], 20: [2] };
const lookup = {
  landkreiseOfMunicipality: id => landkreiseOfMunicipality[id] || [],
  federalStatesOfLandkreis: id => federalStatesOfLandkreis[id] || [],
  federalStatesOfMunicipality: id => [
    ...new Set((landkreiseOfMunicipality[id] || []).flatMap(lk => federalStatesOfLandkreis[lk]))
  ],
  landkreisIdsUnderState: id => (id === 1 ? [10] : [20]),
  municipalityIdsUnderState: id => (id === 1 ? [100, 300] : [200, 300]),
  municipalityIdsUnderLandkreis: id => (id === 10 ? [100, 300] : [200, 300]),
  title: (level, id) => titles[level][id]
};

describe("scopeToUserPayload", () => {
  it("sends only the municipality when it is the anchor, never derived levels", () => {
    const scope = {
      anchorLevel: "municipality",
      anchorId: 69,
      levels: { federalStateId: 2, landkreisId: 3, municipalityId: 69 }
    };
    expect(scopeToUserPayload(scope)).toEqual({ municipality: { id: 69 } });
  });

  it("sends only the landkreis for a landkreis anchor", () => {
    const scope = {
      anchorLevel: "landkreis",
      anchorId: 3,
      levels: { federalStateId: 2, landkreisId: 3, municipalityId: null }
    };
    expect(scopeToUserPayload(scope)).toEqual({ landkreis: { id: 3 } });
  });

  it("sends nothing for an empty or missing scope", () => {
    expect(scopeToUserPayload(emptyScope())).toEqual({});
    expect(scopeToUserPayload(undefined)).toEqual({});
  });

  it("never sends federalState or assignedLocation", () => {
    const payload = scopeToUserPayload({ anchorLevel: "location", anchorId: 5 });
    expect(payload).toEqual({});
  });
});

describe("userDetailToScope", () => {
  it("picks the municipality and ignores legacy extra levels", () => {
    const scope = userDetailToScope({
      municipality: { id: 69 },
      landkreis: { id: 3 },
      federalState: { id: 2 },
      assignedLocation: { id: 7 }
    });
    expect(scope.anchorLevel).toBe("municipality");
    expect(scope.anchorId).toBe(69);
    expect(scope.levels).toBeUndefined();
  });

  it("opening and saving a legacy user without changes sends the anchor only", () => {
    const detail = { municipality: { id: 69 }, landkreis: { id: 3 }, federalState: { id: 2 } };
    expect(scopeToUserPayload(userDetailToScope(detail))).toEqual({ municipality: { id: 69 } });
  });

  it("keeps a landkreis-only user on the landkreis", () => {
    const detail = { municipality: null, landkreis: { id: 43 }, federalState: { id: 2 } };
    const scope = userDetailToScope(detail);
    expect(scope.anchorLevel).toBe("landkreis");
    expect(scope.anchorId).toBe(43);
    expect(scopeToUserPayload(scope)).toEqual({ landkreis: { id: 43 } });
  });

  it("returns an empty scope when nothing is stored", () => {
    expect(userDetailToScope({})).toEqual(emptyScope());
    expect(userDetailToScope(null)).toEqual(emptyScope());
  });
});

describe("selectionToScope", () => {
  it("anchors on the municipality when chosen, else the landkreis", () => {
    expect(selectionToScope({ federalStateId: 1, landkreisId: 10, municipalityId: 100 })).toEqual({
      anchorLevel: "municipality",
      anchorId: 100
    });
    expect(selectionToScope({ federalStateId: 1, landkreisId: 10, municipalityId: null })).toEqual({
      anchorLevel: "landkreis",
      anchorId: 10
    });
  });

  it("a state alone is only a filter and gives an empty anchor", () => {
    expect(selectionToScope({ federalStateId: 1, landkreisId: null, municipalityId: null })).toEqual(emptyScope());
  });

  it("municipalityOnly ignores a landkreis without a municipality", () => {
    const selection = { federalStateId: 1, landkreisId: 10, municipalityId: null };
    expect(selectionToScope(selection, true)).toEqual({ anchorLevel: "municipality", anchorId: null });
  });
});

describe("reconcileSelection", () => {
  it("drops a landkreis and municipality that are not under the new state", () => {
    const selection = { federalStateId: 2, landkreisId: 10, municipalityId: 100 };
    expect(reconcileSelection(selection, "federalState", lookup)).toEqual({
      federalStateId: 2,
      landkreisId: null,
      municipalityId: null
    });
  });

  it("keeps a municipality that is still under the new state", () => {
    const selection = { federalStateId: 2, landkreisId: null, municipalityId: 300 };
    expect(reconcileSelection(selection, "federalState", lookup).municipalityId).toBe(300);
  });

  it("drops a municipality that is not under the new landkreis", () => {
    const selection = { federalStateId: null, landkreisId: 20, municipalityId: 100 };
    expect(reconcileSelection(selection, "landkreis", lookup).municipalityId).toBeNull();
  });

  it("keeps a municipality that is under the new landkreis", () => {
    const selection = { federalStateId: null, landkreisId: 20, municipalityId: 300 };
    expect(reconcileSelection(selection, "landkreis", lookup).municipalityId).toBe(300);
  });
});

describe("filtersForAnchor", () => {
  it("prefills the first derived parent for display only", () => {
    const filters = filtersForAnchor({ anchorLevel: "municipality", anchorId: 300 }, {}, lookup);
    expect(filters).toEqual({ landkreisId: 10, federalStateId: 1 });
  });

  it("keeps the landkreis the admin already picked when it is a parent", () => {
    const filters = filtersForAnchor(
      { anchorLevel: "municipality", anchorId: 300 },
      { landkreisId: 20, federalStateId: 2 },
      lookup
    );
    expect(filters).toEqual({ landkreisId: 20, federalStateId: 2 });
  });

  it("prefers a parent landkreis inside the chosen state", () => {
    const filters = filtersForAnchor(
      { anchorLevel: "municipality", anchorId: 300 },
      { landkreisId: null, federalStateId: 2 },
      lookup
    );
    expect(filters).toEqual({ landkreisId: 20, federalStateId: 2 });
  });

  it("uses the landkreis itself for a landkreis anchor", () => {
    const filters = filtersForAnchor({ anchorLevel: "landkreis", anchorId: 43 }, {}, {
      ...lookup,
      federalStatesOfLandkreis: () => [2]
    });
    expect(filters).toEqual({ landkreisId: 43, federalStateId: 2 });
  });

  it("leaves filters empty for a municipality without a landkreis", () => {
    const filters = filtersForAnchor({ anchorLevel: "municipality", anchorId: 400 }, {}, lookup);
    expect(filters).toEqual({ landkreisId: null, federalStateId: null });
  });
});

describe("pathGroups and pathLabel", () => {
  it("shows state, landkreis and municipality for a single parent", () => {
    const groups = pathGroups({ federalStateId: null, landkreisId: null, municipalityId: 100 }, lookup);
    expect(pathLabel(groups)).toBe("Schleswig-Holstein › Landkreis A › Amt 100");
  });

  it("shows every parent of a municipality in two landkreise", () => {
    const groups = pathGroups({ federalStateId: 1, landkreisId: 10, municipalityId: 300 }, lookup);
    expect(pathLabel(groups)).toBe(
      "Schleswig-Holstein / Rheinland-Pfalz › Landkreis A / Landkreis B › Amt 300"
    );
  });

  it("derives the state of a landkreis-only choice", () => {
    const groups = pathGroups({ federalStateId: null, landkreisId: 20, municipalityId: null }, lookup);
    expect(pathLabel(groups)).toBe("Rheinland-Pfalz › Landkreis B");
  });

  it("shows just the state when only the state filter is set", () => {
    const groups = pathGroups({ federalStateId: 2, landkreisId: null, municipalityId: null }, lookup);
    expect(pathLabel(groups)).toBe("Rheinland-Pfalz");
  });

  it("pathLabel joins parents with / and levels with ›, skipping empty levels", () => {
    expect(pathLabel([["A", "B"], [], ["C"]])).toBe("A / B › C");
    expect(pathLabel([[], [], []])).toBe("");
  });
});

describe("userToForm", () => {
  const guestWithoutLocation = {
    username: "b",
    email: "b@x.de",
    role: { type: "guest" },
    user_detail: { assignedLocation: null, categories: [] }
  };

  it("a guest without a location gets none, whatever the dialog held before", () => {
    const previous = { assignedLocation: { id: 9, title: "Husum" } };
    const form = { ...previous, ...userToForm(guestWithoutLocation) };
    expect(form.assignedLocation).toBeNull();
  });

  it("copies the location of a guest that has one", () => {
    const user = {
      ...guestWithoutLocation,
      user_detail: { assignedLocation: { id: 9, title: "Husum", municipality: { id: 1 } } }
    };
    expect(userToForm(user).assignedLocation).toEqual({ id: 9, title: "Husum" });
  });

  it("maps role types and builds the anchor-only scope", () => {
    const user = {
      username: "a",
      email: "a@x.de",
      role: { type: "authenticated" },
      user_detail: { municipality: { id: 69 }, landkreis: { id: 3 }, federalState: { id: 2 } }
    };
    const form = userToForm(user);
    expect(form.role).toBe("user");
    expect(form.scope).toEqual({ anchorLevel: "municipality", anchorId: 69 });
    expect(form.categories).toEqual([]);
    expect(userToForm({ ...user, role: { type: "leader" } }).role).toBe("leader");
    expect(userToForm({ ...user, role: { type: "admin" } }).role).toBe("admin");
  });
});
