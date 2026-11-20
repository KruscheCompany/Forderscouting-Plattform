import { pickFundingMatches } from "components/projects/create/fundingMatchSource";

const fehlanzeige = { _id: "fehlanzeige", title: "Fehlanzeige", score: 0, selected: true, isFehlanzeige: true };
const saved = [
  { external_id: "1", title: "Alt A", score: 0.9, selected: true },
  { external_id: "2", title: "Alt B", score: 0.7, selected: false }
];
const fresh = [
  { external_id: "3", title: "Neu C", score: 0.8 },
  { external_id: "4", title: "Neu D", score: 0.6 }
];
const keepAll = matches => matches;

const pick = overrides =>
  pickFundingMatches({
    saved: [],
    aiMatches: fresh,
    refreshed: false,
    userValid: true,
    filterAiMatches: keepAll,
    ...overrides
  });

describe("pickFundingMatches", () => {
  it("shows the saved cards of a project that was not refreshed", () => {
    expect(pick({ saved })).toEqual(saved);
  });

  it("never lists the saved Fehlanzeige entry as a funding card", () => {
    expect(pick({ saved: [...saved, fehlanzeige] })).toEqual(saved);
  });

  it("shows nothing for a project that only saved Fehlanzeige until it is refreshed", () => {
    expect(pick({ saved: [fehlanzeige] })).toEqual([]);
  });

  it("shows the refreshed set instead of a saved Fehlanzeige", () => {
    expect(pick({ saved: [fehlanzeige], refreshed: true })).toEqual(fresh);
  });

  it("shows the refreshed set instead of previously saved fundings", () => {
    expect(pick({ saved, refreshed: true })).toEqual(fresh);
  });

  it("applies the user's funding filter to the refreshed set", () => {
    const onlyOne = matches => matches.filter(m => m.external_id === "4");
    expect(pick({ saved: [fehlanzeige], refreshed: true, filterAiMatches: onlyOne })).toEqual([fresh[1]]);
  });

  it("shows nothing after a refresh that returns no matches", () => {
    expect(pick({ saved, refreshed: true, aiMatches: [] })).toEqual([]);
    expect(pick({ saved, refreshed: true, aiMatches: null })).toEqual([]);
  });

  it("shows nothing while the user's data is invalid", () => {
    expect(pick({ saved: [fehlanzeige], refreshed: true, userValid: false })).toEqual([]);
  });

  it("uses the AI matches of a project without a saved funding check", () => {
    expect(pick({ saved: null })).toEqual(fresh);
    expect(pick({ saved: undefined })).toEqual(fresh);
  });
});
