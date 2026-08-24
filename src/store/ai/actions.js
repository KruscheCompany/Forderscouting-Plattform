import { api } from "boot/axios";

let taxonomyAbortController = null;
let taxonomyRequestId = 0;

export async function uploadFundingFile(context, payload) {
  const { fileData, admin_id, onUploadProgress, authToken } = payload;

  // Create FormData
  const formData = new FormData();
  formData.append('data', fileData.file);

  // Add title - use custom title if provided, otherwise use filename without extension
  const title = (fileData.title || '').trim() || fileData.name.replace(/\.[^/.]+$/, '');
  formData.append('title', title);

  // Add admin_id if provided
  if (admin_id) {
    formData.append('admin_id', admin_id);
  }

  // Prepare headers. If an authToken is provided, send it as a Bearer token.
  const headers = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Note: let axios set the Content-Type (it will include proper boundary for FormData)
  const response = await api.post(
    '/api/funding/proxy-upload',
    formData,
    {
      headers,
      onUploadProgress
    }
  );

  return response;
}

export async function matchFunding(context, payload) {
  const { startingCondition,
          goals,
          content,
          valuesAndBenefits,
          finances } = payload;

  context.commit('setLoadingFundingMatches', true);

  try {

    const response = await api.post(
      '/api/funding/proxy-match',
      { startingCondition, goals, content, valuesAndBenefits, finances },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    context.commit('setFundingMatches', response.data);
    return response;

  } catch (error) {
    context.commit('setFundingMatches', []);
    throw error;
  } finally {
    context.commit('setLoadingFundingMatches', false);
  }
}

export async function getFundingQuestions(context, payload) {
  const { fundingId, startingCondition, goals,
          content,
          valuesAndBenefits,
          finances } = payload;

  context.commit('setLoadingFundingQuestions', true);

  try {
    const response = await api.post(
      `/api/funding/proxy-questions/${fundingId}`,
      { startingCondition, goals, content, valuesAndBenefits, finances },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Send both fundingId and questions to the mutation
    context.commit('setFundingQuestions', {
      fundingId,
      questions: response.data.questions
    });

    return response;

  } catch (error) {
    // If error, set empty questions for this funding
    context.commit('setFundingQuestions', {
      fundingId,
      questions: []
    });
    throw error;
  } finally {
    context.commit('setLoadingFundingQuestions', false);
  }
}

export async function suggestTaxonomy(context, payload) {
  const { content, maxSuggestions = 8, maxGenerated = 5 } = payload;

  // Cancel any in-flight suggest request so a slow response can't overwrite a newer one
  if (taxonomyAbortController) {
    taxonomyAbortController.abort();
  }
  const controller = new AbortController();
  taxonomyAbortController = controller;
  const requestId = ++taxonomyRequestId;

  context.commit('setLoadingTaxonomy', true);

  try {
    const response = await api.post(
      '/api/tags/proxy-suggest',
      { content, maxSuggestions, maxGenerated },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );

    if (requestId !== taxonomyRequestId) return response; // superseded by a newer request

    context.commit('setTaxonomySuggestions', response.data);
    return response;

  } catch (error) {
    if (requestId !== taxonomyRequestId) return; // aborted in favor of a newer request

    console.error('suggestTaxonomy: vendor call failed', error);
    context.commit('setTaxonomySuggestions', null);
    return;
  } finally {
    if (requestId === taxonomyRequestId) {
      context.commit('setLoadingTaxonomy', false);
    }
  }
}

export function resetTaxonomySuggestions(context) {
  // Abort any in-flight request and invalidate its id so a late response
  // can't repopulate state after the reset (e.g. navigating edit -> create).
  if (taxonomyAbortController) {
    taxonomyAbortController.abort();
    taxonomyAbortController = null;
  }
  taxonomyRequestId++;

  context.commit('setTaxonomySuggestions', null);
  context.commit('setLoadingTaxonomy', false);
}
