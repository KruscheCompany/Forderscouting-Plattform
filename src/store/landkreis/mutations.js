export function setLandkreise(state, payload) {
  state.landkreise = payload;
}

export function addLandkreis(state, payload) {
  if (!!payload) {
    state.landkreise.push(payload);
  }
}

export function deleteLandkreis(state, payload) {
  if (!!payload) {
    state.landkreise = state.landkreise.filter(
      landkreis => landkreis.id !== payload
    );
  }
}

export function editLandkreis(state, payload) {
  if (!!payload) {
    state.landkreise = [
      ...state.landkreise.map(landkreis => {
        if (landkreis.id === payload.id) {
          return {
            ...landkreis,
            title: payload.title,
            updatedAt: payload.updatedAt
          };
        }
        return landkreis;
      })
    ];
  }
}
