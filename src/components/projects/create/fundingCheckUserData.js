export function validateFundingCheckUser(userDetails) {
  const hasMunicipality = !!(
    userDetails?.municipality ||
    userDetails?.landkreis ||
    userDetails?.resolved?.municipality
  );
  const hasFederalStates = (userDetails?.resolved?.federalStates || []).length > 0;

  return { hasMunicipality, hasFederalStates, isValid: hasMunicipality && hasFederalStates };
}
