import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getProjectIdeas(context) {
  try {
    const res = await api.get("/api/projects");
    context.commit("setProjectIdeas", res.data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getApplicationProcess(context, filters = {}) {
  try {
    // Build query string for filters
    let queryParams = '';

    if (Object.keys(filters).length > 0) {
      queryParams = '?';
      const params = [];

      // Add each filter to the params array if it exists
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.location) params.push(`location=${filters.location}`);
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.investive) params.push(`investive=${filters.investive}`);
      if (filters.categories) params.push(`categories=${filters.categories}`);
      if (filters.tags) params.push(`tags=${filters.tags}`);

      queryParams += params.join('&');
    }

    const res = await api.get(`/api/application/process${queryParams}`);
    context.commit("setApplicationProcess", res.data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function createNewProjectIdea(context, payload) {
  const { projectData } = payload;
  const { files, media, ...dataWithoutFiles } = projectData;

  if (!!projectData) {
    try {
      const res = await api.post("/api/projects?populate[0]=details", { data: dataWithoutFiles });

      if (projectData.files !== null && projectData.files.length > 0) {
        const fileUploadRes = await context.dispatch("uploadFiles", {
          files: projectData.files,
          id: res.data.data.id
        });
      }
      if (projectData.media !== null && projectData.media.length > 0) {
        const mediaUploadRes = await context.dispatch("uploadMedia", {
          media: projectData.media,
          id: res.data.data.id
        });
        console.log("mediaUploadRes", mediaUploadRes);
      }
      context.commit("addNewProjectIdea", res.data.data);
      context.commit("setCreatedProjectIdea", res.data.data);
      // Return the response data for the component to handle
      return res.data;
    } catch (error) {
      console.log("error.response", error.response);
      // Re-throw the error so the component can handle it
      throw error;
    }
  }
}

export async function uploadFiles(context, payload) {
  if (payload.files && payload.id) {
    let formData = new FormData();
    formData.append("ref", "api::project.project");
    formData.append("refId", payload.id);
    formData.append("field", "files");
    if (payload.files.length > 1) {
      payload.files.forEach(file => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", payload.files[0]);
    }
    try {
      const fileRes = await api.post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("fileRes", fileRes);
    } catch (error) {
      console.log("files error.response", error.response);
      Notify.create({
        // position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      // return false;
    }
  }
}

export async function uploadMedia(context, payload) {
  if (payload.media && payload.id) {
    if (payload.media.length > 0) {
      const promises = payload.media.map(async file => {
        const formData = new FormData();
        formData.append("ref", "api::project.project");
        formData.append("refId", payload.id);
        formData.append("field", "media");
        formData.append("files", file);
        formData.append(
          "fileInfo",
          JSON.stringify({
            caption: file.caption
          })
        );
        try {
          return await api.post("api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
        } catch (error) {
          console.log("media error.response", error.response);
          Notify.create({
            type: "negative",
            message: error.response.data.error.message
          });
        }
      });
      return Promise.all(promises);
    } else {
      console.error("No Meida Files");
    }
  }
}

export async function deleteFilesAndMedia(context, payload) {
  console.log("payload", payload);
  if (payload.data) {
    payload.data.forEach(async item => {
      try {
        const deleteRes = await api.delete(`api/upload/files/${item.id}`);
        console.log("deleteRes", deleteRes);
      } catch (error) {
        console.log("files error.response", error.response);
        Notify.create({
          // position: "top-right",
          type: "negative",
          message: error.response.data.error.message
        });
        // return false;
      }
    });
  }
}

export async function editProjectIdea(context, payload) {
  console.log("context.state.project", context.state.project);
  const { projectData: data} = payload;
  console.log("data :>> ", data);
  // delete property 'files' and 'media'
  const { files, media, ...dataWithoutFiles } = data;
  console.log("dataWithoutFiles", dataWithoutFiles);
  if (!!data) {
    try {
      const res = await api.put(`/api/projects/${data.id}?populate[0]=details`, {
        data: dataWithoutFiles
      });
      if (data.media !== null) {
        let added = [];
        if (context.state.project.media === null) {
          added = data.media;
        } else {
          added = data.media.filter(
            newMedia =>
              !context.state.project.media.find(
                oldMedia => oldMedia.id === newMedia.id
              )
          );
        }
        console.log("added", added);
        let deleted = [];
        if (context.state.project.media !== null) {
          deleted = context.state.project.media.filter(
            oldMedia =>
              !data.media.find(newMedia => newMedia.id === oldMedia.id)
          );
        }
        console.log("deleted", deleted);
        if (added.length > 0) {
          const addNewFilesRes = await context.dispatch("uploadMedia", {
            media: added,
            id: res.data.data.id
          });
          console.log("addNewFilesRes", addNewFilesRes);
        }
        if (deleted.length > 0) {
          const deleteFilesRes = await context.dispatch("deleteFilesAndMedia", {
            data: deleted
          });
          console.log("deleteFilesRes", deleteFilesRes);
        }
      }
      if (data.files !== null) {
        let added = [];
        if (context.state.project.files === null) {
          console.log("project files is null");
          added = data.files;
        } else {
          console.log("project files is not null");
          added = data.files.filter(
            newFiles =>
              !context.state.project.files.find(
                oldFiles => oldFiles.id === newFiles.id
              )
          );
        }
        let deleted = [];
        if (context.state.project.files !== null) {
          deleted = context.state.project.files.filter(
            oldFiles =>
              !data.files.find(newFiles => newFiles.id === oldFiles.id)
          );
        }
        if (added.length > 0) {
          const addNewFilesRes = await context.dispatch("uploadFiles", {
            files: added,
            id: res.data.data.id
          });
          console.log("addNewFilesRes", addNewFilesRes);
        }
        if (deleted.length > 0) {
          const deleteFilesRes = await context.dispatch("deleteFilesAndMedia", {
            data: deleted,
            id: res.data.data.id
          });
          console.log("deleteFilesRes", deleteFilesRes);
        }
      }
      Notify.create({
        message: "Projektidee erfolgreich bearbeitet",
        type: "positive"
      });
      context.commit("setCreatedProjectIdea", res.data.data);
      return res.data
    } catch (error) {
      console.error("error", error);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function simpleUpdateProjectIdea(context, payload) {
  const { data } = payload;
  if (!!data) {
    try {
      const res = await api.put(`/api/projects/${data.id}`, {
        data: data
      });
      return res.data;
    }
    catch (error) {
      console.error("error", error);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function getSpecificProject(context, payload) {
  context.commit("setSpecificProject", null);
  const { id } = payload;
  if (id) {
    try {
      const res = await api.get(`/api/projects/${id}`);
      context.commit("setSpecificProject", res.data);
    } catch (error) {
      console.log("error", error);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
    }
  }
}

export async function tempCategories(context, payload) {
  context.commit("setTempCategories", payload);
}

export async function tempTags(context, payload) {
  context.commit("setTempTags", payload);
}

export async function addToWatchlist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.post("/api/watchlists", {
        data: { project: id }
      });
      console.log("res", res);
      Notify.create({
        message: "Projektidee erfolgreich zur Merkliste zugefügt",
        type: "positive"
      });
      context.dispatch("getProjectIdeas");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function removeFromWatchlist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/watchlists/${id}`);
      console.log("res", res);
      Notify.create({
        message: "Projektidee erfolgreich von der Merkliste entfernt",
        type: "positive"
      });
      context.dispatch("getProjectIdeas");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function requestAccess(context, payload) {
  const { id } = payload;
  const { userId } = payload;
  const { type } = payload;
  const { guest } = payload;
  if (!!id && !!userId && !!type) {
    try {
      const res = await api.post("/api/requests", {
        data: {
          user: {
            id: userId
          },
          project: {
            id: id
          },
          type: type,
          guest: guest
        }
      });
      Notify.create({
        message: "Zugangsanfrage für Projektidee gesendet",
        type: "positive"
      });
      context.dispatch("getProjectIdeas");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function archiveProjectIdea(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.put(`/api/projects/${id}`, {
        data: { archived: true }
      });
      console.log("res", res);
      Notify.create({
        message: "Projektidee erfolgreich archiviert",
        type: "positive"
      });
      context.commit("archiveProject");
      context.dispatch("getProjectIdeas");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function duplicateProject(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.post(`/api/project/duplicate/${id}`);
      Notify.create({
        message: "Projektidee erfolgreich dupliziert",
        type: "positive"
      });
      context.dispatch("getProjectIdeas");
      return res;
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function deleteProjectIdea(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/projects/${id}`);
      context.commit("deleteProjectIdea", res.data.data && res.data.data.id);
      Notify.create({
        message: "Projektidee erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getProjectIdeas");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function getProjectDashboardStats(context, filters = {}) {
  try {
    // Build query string for filters
    let queryParams = '';

    if (Object.keys(filters).length > 0) {
      queryParams = '?';
      const params = [];

      // Add each filter to the params array if it exists
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.location) params.push(`location=${filters.location}`);
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.investive) params.push(`investive=${filters.investive}`);
      if (filters.categories) params.push(`categories=${filters.categories}`);
      if (filters.tags) params.push(`tags=${filters.tags}`);

      queryParams += params.join('&');
    }

    const res = await api.get(`/api/project/dashboard/stat${queryParams}`);
    context.commit("setProjectDashboardStats", res.data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
    return false;
  }
}

export async function validateApplicationAccess(context, id) {
  try {
    const res = await api.get(`/api/application/validate/${id}`);
    return res.data; // Returns { id, financialPlan, accessGranted }
  } catch (error) {
    console.error("Error validating application access:", error);
    Notify.create({
      type: "negative",
      message: error.response?.data?.error?.message || "Error validating access"
    });
    return { accessGranted: false };
  }
}
