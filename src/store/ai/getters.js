export function getFundingMatches(state) {
  return state.fundingMatches || [];
}

export function getLoadingFundingMatches(state) {
  return state.isLoadingFundingMatches || false;
}

export function getFundingQuestions(state) {
  return state.fundingQuestions || [];
}

export function getFundingQuestionsMap(state) {
  return state.fundingQuestionsMap || {};
}

export function getQuestionsForFunding(state) {
  return (fundingId) => state.fundingQuestionsMap[fundingId] || [];
}

export function getLoadingFundingQuestions(state) {
  return state.isLoadingFundingQuestions || false;
}
