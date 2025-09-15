export function setFundingMatches(state, matches) {
  state.fundingMatches = matches;
}

export function setLoadingFundingMatches(state, loading) {
  state.isLoadingFundingMatches = loading;
}

export function setFundingQuestions(state, payload) {
  // If payload is an array (backward compatibility), just set the array
  if (Array.isArray(payload)) {
    state.fundingQuestions = payload;
    return;
  }
  
  // If payload contains fundingId and questions
  const { fundingId, questions } = payload;
  
  // Store in the map
  if (fundingId) {
    state.fundingQuestionsMap = {
      ...state.fundingQuestionsMap,
      [fundingId]: questions
    };
  }
  
  // Also store in the array for backward compatibility (using the first funding's questions)
  if (questions) {
    state.fundingQuestions = questions;
  }
}

export function setLoadingFundingQuestions(state, loading) {
  state.isLoadingFundingQuestions = loading;
}
