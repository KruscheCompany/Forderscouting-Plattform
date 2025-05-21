export function setCategories(state, payload) {
  state.categories = payload;
}

export function addCategory(state, payload) {
  if (!!payload) {
    state.categories.push({
      ...payload,
      dataSet: { projects: 0, fundings: 0, checklist: 0 }
    });
  }
}

export function deleteCategory(state, payload) {
  if (!!payload) {
    state.categories = state.categories.filter(
      category => category.id !== payload
    );
  }
}

export function editCategory(state, payload) {
  if (!!payload) {
    // create a copy of state.categories using spread operator. Then map through the array and when the IDs match, update the category with payload
    // with spread operator so we keep the old values in the array
    state.categories = [
      ...state.categories.map(category => {
        if (category.id === payload.id) {
          return { ...category, title: payload.title };
        }
        return category;
      })
    ];
  }
}
