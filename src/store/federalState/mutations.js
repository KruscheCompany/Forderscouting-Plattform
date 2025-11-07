export function setFederalStates(state, payload) {
  state.federalStates = payload;
}

export function addFederalState(state, payload) {
  if (!!payload) {
    state.federalStates.push(payload);
  }
}

export function deleteFederalState(state, payload) {
  if (!!payload) {
    state.federalStates = state.federalStates.filter(
      federalState => federalState.id !== payload
    );
  }
}

export function editFederalState(state, payload) {
  if (!!payload) {
    state.federalStates = [
      ...state.federalStates.map(federalState => {
        if (federalState.id === payload.id) {
          return {
            ...federalState,
            title: payload.title,
            updatedAt: payload.updatedAt
          };
        }
        return federalState;
      })
    ];
  }
}
