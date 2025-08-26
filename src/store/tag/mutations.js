export function setTags(state, payload) {
  state.tags = payload;
}

export function setTagsSimplified(state, payload) {
  state.tagsSimplified = payload;
}

export function addTag(state, payload) {
  if (!!payload) {
    state.tags.push({
      ...payload,
      dataSet: { projects: 0, fundings: 0, checklist: 0 }
    });
  }
}

export function deleteTag(state, payload) {
  if (!!payload) {
    state.tags = state.tags.filter(tag => tag.id !== payload);
  }
}

export function editTag(state, payload) {
  if (!!payload) {
    // create a copy of state.categories using spread operator. Then map through the array and when the IDs match, update the category with payload
    // with spread operator so we keep the old values in the array
    state.tags = [
      ...state.tags.map(tag => {
        if (tag.id === payload.id) {
          return { ...tag, title: payload.title };
        }
        return tag;
      })
    ];
  }
}
