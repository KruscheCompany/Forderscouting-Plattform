import {
  relationId,
  hasRelation,
  relationsOf
} from "src/store/hierarchyHelpers";

describe("hierarchyHelpers", () => {
  it("relationId unwraps populated objects and passes plain ids through", () => {
    expect(relationId({ id: 3 })).toBe(3);
    expect(relationId(3)).toBe(3);
  });

  it("hasRelation matches mixed plain and populated entries", () => {
    expect(hasRelation([{ id: 1 }, 2], 2)).toBe(true);
    expect(hasRelation([{ id: 1 }, 2], 1)).toBe(true);
    expect(hasRelation([{ id: 1 }, 2], 9)).toBe(false);
    expect(hasRelation(undefined, 1)).toBe(false);
  });

  it("relationsOf returns the relation array or [] for unknown ids", () => {
    const records = [{ id: 1, landkreise: [5] }];
    expect(relationsOf(records, 1, "landkreise")).toEqual([5]);
    expect(relationsOf(records, 2, "landkreise")).toEqual([]);
    expect(relationsOf(records, 1, "missing")).toEqual([]);
  });
});
