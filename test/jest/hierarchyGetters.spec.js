import * as federalStateGetters from "src/store/federalState/getters";
import * as landkreisGetters from "src/store/landkreis/getters";
import * as municipalityGetters from "src/store/municipality/getters";

// state 1 <- landkreis 10 <- muni 100; state 2 <- landkreis 20 <- muni 200;
// muni 300 sits in landkreis 10 and 20; muni 400 has no landkreis.
const rootState = {
  federalState: { federalStates: [{ id: 1 }, { id: 2 }] },
  landkreis: {
    landkreise: [
      { id: 10, federalStates: [1], municipalities: [100, 300] },
      { id: 20, federalStates: [2], municipalities: [200, 300] }
    ]
  },
  municipality: {
    municipalities: [
      { id: 100, landkreise: [{ id: 10 }] },
      { id: 200, landkreise: [{ id: 20 }] },
      { id: 300, landkreise: [{ id: 10 }, { id: 20 }] },
      { id: 400, landkreise: [] }
    ]
  }
};

const landkreisState = rootState.landkreis;
const municipalityState = rootState.municipality;

const landkreisGetterFns = {
  federalStatesOf: landkreisGetters.federalStatesOf(landkreisState, {}, rootState),
  municipalitiesUnder: landkreisGetters.municipalitiesUnder(landkreisState, {}, rootState)
};
const rootGetters = {
  "landkreis/federalStatesOf": landkreisGetterFns.federalStatesOf,
  "landkreis/municipalitiesUnder": landkreisGetterFns.municipalitiesUnder,
  "municipality/parentLandkreise": municipalityGetters.parentLandkreise(municipalityState),
  "federalState/landkreiseUnder": federalStateGetters.landkreiseUnder({}, {}, rootState)
};

const sorted = (ids) => [...ids].sort((a, b) => a - b);

describe("hierarchy getters", () => {
  it("federalStatesOfMunicipality unions the states of every parent landkreis", () => {
    const fn = municipalityGetters.federalStatesOfMunicipality(municipalityState, {}, rootState, rootGetters);
    expect(sorted(fn(300))).toEqual([1, 2]);
    expect(fn(100)).toEqual([1]);
  });

  it("federalStatesOfMunicipality is empty for a municipality without landkreis", () => {
    const fn = municipalityGetters.federalStatesOfMunicipality(municipalityState, {}, rootState, rootGetters);
    expect(fn(400)).toEqual([]);
    expect(fn(999)).toEqual([]);
  });

  it("municipalitiesUnderState unions the municipalities of every landkreis in the state", () => {
    const fn = federalStateGetters.municipalitiesUnderState({}, {}, rootState, rootGetters);
    expect(sorted(fn(1))).toEqual([100, 300]);
    expect(sorted(fn(2))).toEqual([200, 300]);
  });

  it("municipalitiesUnderState is empty for an unknown state", () => {
    const fn = federalStateGetters.municipalitiesUnderState({}, {}, rootState, rootGetters);
    expect(fn(999)).toEqual([]);
  });
});
