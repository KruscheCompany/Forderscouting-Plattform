import * as federalStateGetters from "src/store/federalState/getters";
import * as landkreisGetters from "src/store/landkreis/getters";
import { municipalityOptions, pruneSelection } from "components/funding/fundingTargets";

// state 1 = Rheinland-Pfalz <- landkreis 3 <- muni 69 (no direct state link);
// state 2 <- landkreis 20 <- munis 200, 300; muni 300 is also in landkreis 3.
const rootState = {
  federalState: { federalStates: [{ id: 1 }, { id: 2 }] },
  landkreis: {
    landkreise: [
      { id: 3, federalStates: [1], municipalities: [69, 300] },
      { id: 20, federalStates: [2], municipalities: [200, 300] }
    ]
  },
  municipality: {
    municipalities: [
      { id: 69, title: "VG Fördermittel", federalStates: [] },
      { id: 200, title: "Amt Beta", federalStates: [] },
      { id: 300, title: "Amt Alpha", federalStates: [] },
      { id: 400, title: "Ohne Kreis", federalStates: [{ id: 1 }] }
    ]
  }
};

const rootGetters = {
  "federalState/landkreiseUnder": federalStateGetters.landkreiseUnder({}, {}, rootState),
  "landkreis/municipalitiesUnder": landkreisGetters.municipalitiesUnder(rootState.landkreis, {}, rootState)
};
const getters = {
  ...rootGetters,
  "federalState/municipalitiesUnderState": federalStateGetters.municipalitiesUnderState({}, {}, rootState, rootGetters)
};
const municipalities = rootState.municipality.municipalities;

describe("municipalityOptions", () => {
  it("offers a municipality that is only reachable through a Landkreis (RLP -> 69)", () => {
    const options = municipalityOptions({ stateIds: [1], landkreisIds: [], getters, municipalities });
    expect(options.map((m) => m.id)).toContain(69);
  });

  it("ignores the legacy direct federalStates link", () => {
    const options = municipalityOptions({ stateIds: [1], landkreisIds: [], getters, municipalities });
    expect(options.map((m) => m.id)).not.toContain(400);
  });

  it("sorts options by title", () => {
    const options = municipalityOptions({ stateIds: [1, 2], landkreisIds: [], getters, municipalities });
    expect(options.map((m) => m.title)).toEqual(["Amt Alpha", "Amt Beta", "VG Fördermittel"]);
  });

  it("narrows to the selected Landkreise when there are any", () => {
    const options = municipalityOptions({ stateIds: [1, 2], landkreisIds: [20], getters, municipalities });
    expect(options.map((m) => m.id).sort()).toEqual([200, 300]);
  });

  it("returns nothing without a selected state", () => {
    expect(municipalityOptions({ stateIds: [], landkreisIds: [], getters, municipalities })).toEqual([]);
  });

  it("does not duplicate a municipality in several Landkreise", () => {
    const options = municipalityOptions({ stateIds: [1, 2], landkreisIds: [3, 20], getters, municipalities });
    expect(options.filter((m) => m.id === 300)).toHaveLength(1);
  });
});

describe("pruneSelection", () => {
  const landkreise = rootState.landkreis.landkreise;

  it("drops 69 and its Landkreis when Rheinland-Pfalz is deselected", () => {
    expect(
      pruneSelection({ stateIds: [2], landkreisIds: [3, 20], municipalityIds: [69, 200], landkreise })
    ).toEqual({ landkreisIds: [20], municipalityIds: [200] });
  });

  it("keeps 69 while Rheinland-Pfalz stays selected", () => {
    expect(
      pruneSelection({ stateIds: [1], landkreisIds: [3], municipalityIds: [69], landkreise })
    ).toEqual({ landkreisIds: [3], municipalityIds: [69] });
  });

  it("keeps a municipality that is still under another selected state", () => {
    expect(
      pruneSelection({ stateIds: [2], landkreisIds: [], municipalityIds: [300], landkreise })
    ).toEqual({ landkreisIds: [], municipalityIds: [300] });
  });

  it("clears everything placed in the hierarchy when no state is selected", () => {
    expect(
      pruneSelection({ stateIds: [], landkreisIds: [3], municipalityIds: [69], landkreise })
    ).toEqual({ landkreisIds: [], municipalityIds: [] });
  });

  it("prunes nothing while the Landkreise are not loaded", () => {
    expect(
      pruneSelection({ stateIds: [2], landkreisIds: [3], municipalityIds: [69], landkreise: [] })
    ).toEqual({ landkreisIds: [3], municipalityIds: [69] });
  });

  it("keeps a municipality that has no known Landkreis", () => {
    expect(
      pruneSelection({ stateIds: [2], landkreisIds: [], municipalityIds: [999], landkreise })
    ).toEqual({ landkreisIds: [], municipalityIds: [999] });
  });

  it("keeps a Landkreis without a known state", () => {
    const withOrphan = [...landkreise, { id: 50, federalStates: [], municipalities: [777] }];
    expect(
      pruneSelection({ stateIds: [2], landkreisIds: [50], municipalityIds: [777], landkreise: withOrphan })
    ).toEqual({ landkreisIds: [50], municipalityIds: [777] });
  });
});
