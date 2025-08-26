export function setProjectIdeas(state, payload) {
  state.projects = payload.sort((a, b) => {
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

export function addNewProjectIdea(state, payload) {
  if (!!payload) {
    state.projects.push(payload);
  }
}

export function deleteProjectIdea(state, payload) {
  if (!!payload) {
    state.projects = state.projects.filter(project => project.id !== payload);
    state.project = {};
  }
}

export function setSpecificProject(state, payload) {
  state.project = payload;
}

export function setTempCategories(state, payload) {
  state.tempCategories = payload;
}

export function setTempTags(state, payload) {
  state.tempTags = payload;
}

export function archiveProject(state, payload) {
  if (state.project) {
    state.project.archived = true;
  }
}

export function setCreatedProjectIdea(state, payload) {
  state.createdProjectIdea = payload;
}

export function setProjectDashboardStats(state, payload) {
  state.projectDashboardStats = payload;
}

export function setApplicationProcess(state, payload) {
  state.applicationProcess = payload;
}

export function setFinancialPlan(state, payload) {
  state.financialPlan = payload;
}
