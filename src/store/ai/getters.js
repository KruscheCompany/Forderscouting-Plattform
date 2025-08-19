export function getFundingMatches(state) {
  return state.fundingMatches || [];
}

export function getLoadingFundingMatches(state) {
  return state.isLoadingFundingMatches || false;
}

export function getFundingQuestions(state) {
  return state.fundingQuestions || [];
}
