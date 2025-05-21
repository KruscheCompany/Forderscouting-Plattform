export function setFundings(state, payload) {
  state.fundings = payload.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
}

export function setFundingsWithArchived(state, payload) {
  state.fundings = payload.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
}

export function addNewFunding(state, payload) {
  if (!!payload) {
    state.fundings.push(payload);
  }
}

// export function editProjectIdea(state, payload) {
//   console.log("edit project idea payload", payload);
// }

export function deleteFunding(state, payload) {
  if (!!payload) {
    state.fundings = state.fundings.filter(funding => funding.id !== payload);
    state.funding = {};
  }
}

export function setSpecificFunding(state, payload) {
  state.funding = payload;
}

export function archiveFunding(state, payload) {
  if (state.funding) {
    state.funding.archived = true;
  }
}
