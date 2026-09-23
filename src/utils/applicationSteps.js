// Where a project opens, shared by the edit and the read-only view so both
// land on the same tab and step.

// The tab after the last completed one; the last tab once everything is done.
export function landingTabName(tabs) {
  if (!tabs || !tabs.length) return null;

  let lastDoneIndex = -1;
  tabs.forEach((tab, index) => {
    if (tab.done) lastDoneIndex = index;
  });

  if (lastDoneIndex === -1) return tabs[0].name;
  return tabs[Math.min(lastDoneIndex + 1, tabs.length - 1)].name;
}

// The step the user was working on, otherwise the first one after the last
// completed step, skipping steps that do not apply to this project.
export function landingStepName(steps) {
  if (!steps || !steps.length) return null;

  const inProgress = steps.find(step => step.inProgress && !step.skip);
  if (inProgress) return inProgress.name;

  let lastDoneIndex = -1;
  steps.forEach((step, index) => {
    if (step.done) lastDoneIndex = index;
  });

  if (lastDoneIndex === -1) return steps[0].name;

  let nextIndex = lastDoneIndex + 1;
  while (nextIndex < steps.length && steps[nextIndex].skip) {
    nextIndex += 1;
  }
  // Every remaining step skipped means there is no next step to land on;
  // fall back to the last done one rather than a step that renders nothing.
  return nextIndex < steps.length ? steps[nextIndex].name : steps[lastDoneIndex].name;
}

// Colour for a step that was started but not finished, so it stands out from
// steps not reached yet (Quasar only colours active and done steps otherwise).
export function stepColor(step) {
  return step.inProgress && !step.done && !step.skip ? 'orange-8' : undefined;
}
