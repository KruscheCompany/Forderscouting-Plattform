/**
 * Migrates old persisted step-array shapes for projects that predate the
 * PAV-206 Antragsweg restructure, so old data doesn't break the stepper.
 *
 * Before the restructure:
 *   projectDevelopmentSteps had separate 'goals' and 'requirements' entries.
 *   projectApplicationSteps had separate 'guidelineFormCheck' and
 *   'guidelineContentCheck' entries, plus a 'financingCheck' entry.
 *
 * After the restructure:
 *   projectDevelopmentSteps has a single 'goalsAndRequirements' entry, and a
 *   'financingCheck' entry (moved here from projectApplicationSteps).
 *   projectApplicationSteps has a single 'guidelineContentCheck' entry
 *   (guidelineFormCheck folded into it) and no more 'financingCheck' entry.
 *
 * This is a pure, read-time FE normalization only - it does not touch the
 * backend or mutate its input. Old rows keep their old shape in the DB.
 */

const GOALS_AND_REQUIREMENTS_STEP = {
  name: 'goalsAndRequirements',
  title: 'Goals and requirements',
  icon: 'mdi-target',
};

/**
 * Normalizes projectDevelopmentSteps and projectApplicationSteps on a project
 * object to the new (post PAV-206) shape, if they're present and still in the
 * old shape. Returns a new object; never mutates the input. Safe to call on
 * already-new-shape data (idempotent - no-op) or partial/defensive old data.
 *
 * @param {object} project - project object as received from the API.
 * @returns {object} a new project object with normalized step arrays.
 */
export function normalizeApplicationProcessSteps(project) {
  if (!project || typeof project !== 'object') {
    return project;
  }

  let developmentSteps = Array.isArray(project.projectDevelopmentSteps)
    ? project.projectDevelopmentSteps.map(step => ({ ...step }))
    : project.projectDevelopmentSteps;

  let applicationSteps = Array.isArray(project.projectApplicationSteps)
    ? project.projectApplicationSteps.map(step => ({ ...step }))
    : project.projectApplicationSteps;

  // --- Extract financingCheck out of projectApplicationSteps (old shape) ---
  let financingCheckFromApplication = null;
  if (Array.isArray(applicationSteps)) {
    const financingIndex = applicationSteps.findIndex(step => step.name === 'financingCheck');
    if (financingIndex !== -1) {
      financingCheckFromApplication = applicationSteps[financingIndex];
      applicationSteps = applicationSteps.filter((_, idx) => idx !== financingIndex);
    }
  }

  // --- Fold guidelineFormCheck into guidelineContentCheck (old shape) ---
  if (Array.isArray(applicationSteps)) {
    const formCheckIndex = applicationSteps.findIndex(step => step.name === 'guidelineFormCheck');
    if (formCheckIndex !== -1) {
      const formCheck = applicationSteps[formCheckIndex];
      const contentCheckIndex = applicationSteps.findIndex(step => step.name === 'guidelineContentCheck');
      if (contentCheckIndex !== -1) {
        const contentCheck = applicationSteps[contentCheckIndex];
        contentCheck.done = !!contentCheck.done && !!formCheck.done;
      }
      applicationSteps = applicationSteps.filter((_, idx) => idx !== formCheckIndex);
    }
  }

  // --- Merge goals + requirements into goalsAndRequirements (old shape) ---
  if (Array.isArray(developmentSteps)) {
    const goalsIndex = developmentSteps.findIndex(step => step.name === 'goals');
    const requirementsIndex = developmentSteps.findIndex(step => step.name === 'requirements');

    if (goalsIndex !== -1 || requirementsIndex !== -1) {
      const goalsStep = goalsIndex !== -1 ? developmentSteps[goalsIndex] : null;
      const requirementsStep = requirementsIndex !== -1 ? developmentSteps[requirementsIndex] : null;

      let done;
      if (goalsStep && requirementsStep) {
        done = !!goalsStep.done && !!requirementsStep.done;
      } else {
        done = !!(goalsStep || requirementsStep).done;
      }
      const skip = !!((goalsStep && goalsStep.skip) || (requirementsStep && requirementsStep.skip));

      const insertAt = Math.min(
        ...[goalsIndex, requirementsIndex].filter(idx => idx !== -1)
      );

      const mergedStep = { ...GOALS_AND_REQUIREMENTS_STEP, done, skip };

      const remaining = developmentSteps.filter(
        (_, idx) => idx !== goalsIndex && idx !== requirementsIndex
      );
      // insertAt was computed against the original array; after removing the
      // 'goals'/'requirements' entries, clamp it to the remaining array length.
      const clampedInsertAt = Math.min(insertAt, remaining.length);
      developmentSteps = [
        ...remaining.slice(0, clampedInsertAt),
        mergedStep,
        ...remaining.slice(clampedInsertAt),
      ];
    }

    // Append the financingCheck step (moved from projectApplicationSteps),
    // unless developmentSteps already has one (new-shape data - don't duplicate).
    if (financingCheckFromApplication) {
      const alreadyHasFinancingCheck = developmentSteps.some(step => step.name === 'financingCheck');
      if (!alreadyHasFinancingCheck) {
        developmentSteps = [...developmentSteps, financingCheckFromApplication];
      }
    }
  }

  return {
    ...project,
    ...(Array.isArray(developmentSteps) ? { projectDevelopmentSteps: developmentSteps } : {}),
    ...(Array.isArray(applicationSteps) ? { projectApplicationSteps: applicationSteps } : {}),
  };
}
