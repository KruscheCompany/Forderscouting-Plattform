export function setMunicipalities(state, payload) {
  state.municipalities = payload;
}

export function setMunicipalitiesSimplified(state, payload) {
  state.municipalitiesSimplified = payload;
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
            verwaltungssitz: payload.verwaltungssitz,
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

export function setLocationsSimplified(state, payload) {
  state.locationsSimplified = payload;
}


