import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getFundings(context) {
  try {
    const res = await api.get("/api/fundings");
    context.commit("setFundings", res.data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getFundingsWithArchived(context) {
  try {
    const res = await api.get("/api/fundings?withArchived=true");
    context.commit("setFundingsWithArchived", res.data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function createNewFunding(context, payload) {
  const { data } = payload;
  console.log("data :>> ", data);
  // delete property 'files' and 'media'
  const { files, media, ...dataWithoutFiles } = data;
  console.log("dataWithoutFiles", dataWithoutFiles);
  if (!!data) {
    try {
      const res = await api.post("/api/fundings", { data: dataWithoutFiles });
      console.log("res :>> ", res);
      context.commit("addNewFunding", res.data.data);
      if (data.files !== null && data.files.length > 0) {
        const fileUploadRes = await context.dispatch("uploadFiles", {
          files: data.files,
          id: res.data.data.id
        });
        console.log("fileUploadRes", fileUploadRes);
      }
      if (data.media !== null && data.media.length > 0) {
        const mediaUploadRes = await context.dispatch("uploadMedia", {
          media: data.media,
          id: res.data.data.id
        });
        console.log("mediaUploadRes", mediaUploadRes);
      }
      Notify.create({
        message: "Neue Förder-Kurzinfo erfolgreich hinzugefügt",
        type: "positive"
      });
      // context.dispatch("getProjectIdeas");
      // this.$router.push({ path: "/user/data?tab=fundings" });
      this.$router.go(-1);
    } catch (error) {
      console.log("error.response", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function uploadFiles(context, payload) {
  if (payload.files && payload.id) {
    let formData = new FormData();
    formData.append("ref", "api::funding.funding");
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
        formData.append("ref", "api::funding.funding");
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
          type: "negative",
          message: error.response.data.error.message
        });
        // return false;
      }
    });
  }
}

export async function editFunding(context, payload) {
  console.log("context.state.funding", context.state.funding);
  const { data } = payload;
  console.log("data :>> ", data);
  // delete property 'files' and 'media'
  const { files, media, ...dataWithoutFiles } = data;
  console.log("dataWithoutFiles", dataWithoutFiles);
  if (!!data) {
    try {
      const res = await api.put(`/api/fundings/${data.id}`, {
        data: dataWithoutFiles
      });
      console.log("res :>> ", res);
      // context.commit("editProjectIdea", res.data.data);
      if (data.media !== null) {
        let added = [];
        if (context.state.funding.media === null) {
          added = data.media;
        } else {
          added = data.media.filter(
            newMedia =>
              !context.state.funding.media.find(
                oldMedia => oldMedia.id === newMedia.id
              )
          );
        }

        let deleted = [];
        if (context.state.funding.media !== null) {
          deleted = context.state.funding.media.filter(
            oldMedia =>
              !data.media.find(newMedia => newMedia.id === oldMedia.id)
          );
        }

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
        if (context.state.funding.files === null) {
          console.log("project files is null");
          added = data.files;
        } else {
          console.log("project files is not null");
          added = data.files.filter(
            newFiles =>
              !context.state.funding.files.find(
                oldFiles => oldFiles.id === newFiles.id
              )
          );
        }
        let deleted = [];
        if (context.state.funding.files !== null) {
          deleted = context.state.funding.files.filter(
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
        message: "Förder-Kurzinfo erfolgreich bearbeitet",
        type: "positive"
      });
      // context.dispatch("getProjectIdeas");
      // this.$router.push({
      //   path: "/user/data?tab=fundings"
      // });
      this.$router.go(-1);
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
export async function getSpecificFunding(context, payload) {
  console.log("payload", payload);
  context.commit("setSpecificFunding", null);
  const { id } = payload;
  if (id) {
    try {
      const res = await api.get(`/api/fundings/${id}`);
      context.commit("setSpecificFunding", res.data);
      // return res.data.id;
    } catch (error) {
      console.log("error", error);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
    }
  }
}

export async function requestAccess(context, payload) {
  const { id } = payload;
  const { userId } = payload;
  const { type } = payload;
  const { guest } = payload;
  console.log("id", id);
  console.log("userId", userId);
  console.log("type", type);
  if (!!id && !!userId && !!type) {
    try {
      const res = await api.post("/api/requests", {
        data: {
          user: {
            id: userId
          },
          funding: {
            id: id
          },
          type: type,
          guest: guest
        }
      });
      Notify.create({
        message: "Förder-Kurzinfo Anfrage gesendet",
        type: "positive"
      });
      context.dispatch("getFundings");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function archiveFunding(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.put(`/api/fundings/${id}`, {
        data: { archived: true }
      });
      console.log("res", res);
      Notify.create({
        message: "Förder-Kurzinfo erfolgreich archiviert",
        type: "positive"
      });
      context.commit("archiveFunding");
      context.dispatch("getFundings");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function addToWatchlist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.post("/api/watchlists", {
        data: { funding: id }
      });
      console.log("res", res);
      Notify.create({
        message: "Förder-Kurzinfo zur Merkliste hinzugefügt",
        type: "positive"
      });
      context.dispatch("getFundings");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function addComment(context, payload) {
  const { comment } = payload;
  const { fundingId } = payload;
  const { userId } = payload;
  if (!!comment && !!fundingId && !!userId) {
    try {
      const res = await api.post("/api/funding-comments", {
        data: { comment, funding: fundingId, owner: userId }
      });
      Notify.create({
        message: "Kommentar erfolgreich hinzugefügt",
        type: "positive"
      });
      context.dispatch("getSpecificFunding", { id: fundingId });
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
        message: "Förder-Kurzinfo erfolgreich von der Merkliste entfernt",
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

export async function deleteFunding(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/fundings/${id}`);
      context.commit("deleteFunding", res.data.data && res.data.data.id);
      Notify.create({
        message: "Förder-Kurzinfo erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getFundings");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}
