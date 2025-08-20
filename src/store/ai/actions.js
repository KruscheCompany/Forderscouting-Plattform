import { api } from "boot/axios";

export async function uploadFundingFile(context, payload) {
  const { fileData, onUploadProgress } = payload;

  // Create FormData
  const formData = new FormData();
  formData.append('data', fileData.file);

  // Add title - use custom title if provided, otherwise use filename without extension
  const title = fileData.title.trim() || fileData.name.replace(/\.[^/.]+$/, '');
  formData.append('title', title);

  // Make API request
  const response = await api.post(
    `${process.env.VUE_APP_AI}/funding/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    }
  );

  return response;
}

export async function matchFunding(context, payload) {
  const { projectData } = payload;

  context.commit('setLoadingFundingMatches', true);

  try {

    const response = await api.post(
      `${process.env.VUE_APP_AI}/funding/matching`,
      { idea: projectData }
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
  const { fundingId, idea } = payload;

  context.commit('setLoadingFundingQuestions', true);

  try {
    const response = await api.post(
      `${process.env.VUE_APP_AI}/funding/questions/${fundingId}`,
      { idea }
    );

    context.commit('setFundingQuestions', response.data.questions);
    return response;

  } catch (error) {
    context.commit('setFundingQuestions', []);
    throw error;
  } finally {
    context.commit('setLoadingFundingQuestions', false);
  }
}
