// A project that already saved its funding check shows the saved cards, but once the
// user refreshes, the freshly fetched set replaces them (also when only the
// "Fehlanzeige" card had been saved).
export function pickFundingMatches({ saved, aiMatches, refreshed, userValid, filterAiMatches }) {
  const savedMatches = saved || [];
  if (savedMatches.length > 0 && !refreshed) {
    return savedMatches.filter(funding => !funding.isFehlanzeige);
  }
  if (!aiMatches || aiMatches.length === 0 || !userValid) {
    return [];
  }
  return filterAiMatches(aiMatches);
}
