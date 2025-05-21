export function setMunicipalities(state, payload) {
  state.municipalities = payload;
}

export function addMunicipality(state, payload) {
  if (!!payload) {
    state.municipalities.push(payload);
  }
}

export function deleteMunicipality(state, payload) {
  if (!!payload) {
    state.municipalities = state.municipalities.filter(
      municipality => municipality.id !== payload
    );
  }
}

export function editMunicipality(state, payload) {
  if (!!payload) {
    state.municipalities = [
      ...state.municipalities.map(municipality => {
        if (municipality.id === payload.id) {
          return {
            ...municipality,
            title: payload.title,
            location: payload.location,
            updatedAt: payload.updatedAt
          };
        }
        return municipality;
      })
    ];
  }
}

export function setTempMunicipality(state, payload) {
  state.tempMunicipality = payload;
}

export function setStates(state, payload) {
  state.states = payload;
}

export function setGroupedStates(state, payload) {
  state.groupedStates = payload;
}

export function addState(state, payload) {
  console.log('!!!', payload);
  if (!!payload) {
    state.states.push(payload);
  }
}

export function deleteState(state, payload) {
  if (!!payload) {
    state.states = state.states.filter(state => state.id !== payload);
  }
}

export function editState(state, payload) {
  if (!!payload) {
    state.states = [
      ...state.states.map(state => {
        if (state.id === payload.id) {
          return {
            ...state,
            title: payload.title,
            municipality: payload.municipality,
            updatedAt: payload.updatedAt
          };
        }
        return state;
      })
    ];
  }
}


