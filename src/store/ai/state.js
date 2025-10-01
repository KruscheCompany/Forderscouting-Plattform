export default function () {
  return {
    fundingMatches: [],
    isLoadingFundingMatches: false,
    fundingQuestions: [], // Keep for backward compatibility
    fundingQuestionsMap: {}, // Map of funding ID to questions array
    isLoadingFundingQuestions: false
  }
}
