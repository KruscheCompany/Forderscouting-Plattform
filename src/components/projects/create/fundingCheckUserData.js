export function validateFundingCheckUser(userDetails) {
  const hasMunicipality = !!(
    userDetails?.municipality ||
    userDetails?.landkreis ||
    userDetails?.resolved?.municipality
  );
  const hasFederalStates = (userDetails?.resolved?.federalStates || []).length > 0;

  return { hasMunicipality, hasFederalStates, isValid: hasMunicipality && hasFederalStates };
}

// Session data stored before the API returned `resolved` has to be refreshed once.
export function needsUserDetailsRefresh(userDetails) {
  return !!userDetails && !userDetails.resolved;
}
