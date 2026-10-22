import { validateFundingCheckUser, needsUserDetailsRefresh } from "components/projects/create/fundingCheckUserData";

describe("validateFundingCheckUser", () => {
  it("accepts a municipality user whose resolved federal states are set", () => {
    expect(
      validateFundingCheckUser({
        municipality: { id: 5 },
        resolved: { federalStates: [{ id: 2 }], landkreise: [], municipality: { id: 5 }, locationIds: [] }
      })
    ).toEqual({ hasMunicipality: true, hasFederalStates: true, isValid: true });
  });

  it("accepts a Landkreis-only user", () => {
    expect(
      validateFundingCheckUser({
        landkreis: { id: 10 },
        resolved: { federalStates: [{ id: 1 }], landkreise: [{ id: 10 }], municipality: null, locationIds: [] }
      })
    ).toEqual({ hasMunicipality: true, hasFederalStates: true, isValid: true });
  });

  it("accepts a guest whose municipality is only known through resolved", () => {
    const result = validateFundingCheckUser({
      resolved: { federalStates: [{ id: 1 }], landkreise: [], municipality: { id: 7 }, locationIds: [3] }
    });
    expect(result.hasMunicipality).toBe(true);
    expect(result.isValid).toBe(true);
  });

  it("flags empty resolved federal states", () => {
    expect(
      validateFundingCheckUser({
        municipality: { id: 5 },
        resolved: { federalStates: [], landkreise: [], municipality: { id: 5 }, locationIds: [] }
      })
    ).toEqual({ hasMunicipality: true, hasFederalStates: false, isValid: false });
  });

  it("is invalid without throwing when resolved is missing", () => {
    expect(() => validateFundingCheckUser({ municipality: { id: 5 } })).not.toThrow();
    expect(validateFundingCheckUser({ municipality: { id: 5 } })).toEqual({
      hasMunicipality: true,
      hasFederalStates: false,
      isValid: false
    });
  });

  it("is invalid for null user details", () => {
    expect(validateFundingCheckUser(null)).toEqual({
      hasMunicipality: false,
      hasFederalStates: false,
      isValid: false
    });
  });
});

describe("needsUserDetailsRefresh", () => {
  it("is true when stored user details predate resolved", () => {
    expect(needsUserDetailsRefresh({ municipality: { id: 5 } })).toBe(true);
  });

  it("is false once resolved is present, even with no federal states", () => {
    expect(needsUserDetailsRefresh({ resolved: { federalStates: [] } })).toBe(false);
  });

  it("is false without user details", () => {
    expect(needsUserDetailsRefresh(null)).toBe(false);
  });
});
