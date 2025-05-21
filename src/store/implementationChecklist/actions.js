import { api } from "boot/axios";
import { Notify } from "quasar";

export async function getChecklists(context) {
  try {
    const res = await api.get("/api/checklists");
    context.commit("setChecklists", res.data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function createNewChecklist(context, payload) {
  const { data } = payload;
  if (!!data) {
    console.log("data", data);
    const initialContact = await constructInitialContact(
      data.items.find(item => item.cardName === "initialContact"),
      false
    );
    const preparation = await constructpreparation(
      data.items.find(item => item.cardName === "preparation"),
      false
    );
    const fundingResearch = await constructFundingResearch(
      data.items.find(item => item.cardName === "fundingResearch"),
      false
    );
    const preparationOfProject = await constructPreparationOfProject(
      data.items.find(item => item.cardName === "preparationOfProject"),
      false
    );
    const legitimation = await constructLegitimation(
      data.items.find(item => item.cardName === "legitimation"),
      false
    );
    const finalExamination = await constructFinalExamination(
      data.items.find(item => item.cardName === "finalExamination"),
      false
    );
    // Remove items property from original object & create new object called finalData
    const { items, ...finalData } = {
      ...data,
      initialContact,
      preparation,
      fundingResearch,
      preparationOfProject,
      legitimation,
      finalExamination
    };
    console.log("finalData", finalData);
    if (!finalData?.project?.id) {
      delete finalData.project;
    }
    // Delete files and media properties from finalData and add them to finalDataWithoutFiles object
    const dataWithoutFiles = JSON.parse(JSON.stringify(finalData));
    for (const key in dataWithoutFiles) {
      if (
        typeof dataWithoutFiles[key] === "object" &&
        !!dataWithoutFiles[key] &&
        dataWithoutFiles[key].hasOwnProperty("start")
      ) {
        for (const subKey in dataWithoutFiles[key]) {
          delete dataWithoutFiles[key][subKey].file;
        }
      }
    }
    delete dataWithoutFiles.media;
    console.log("dataWithoutFiles", dataWithoutFiles);
    try {
      const res = await api.post("/api/checklists", { data: dataWithoutFiles });
      console.log("res :>> ", res);
      try {
        const createdChecklist = await api.get(
          `/api/checklists/${res.data.data.id}`
        );
        // Upload media
        if (finalData.media !== null && finalData.media.length > 0) {
          const mediaUploadRes = await context.dispatch("uploadMedia", {
            media: finalData.media,
            id: res.data.data.id
          });
          console.log("mediaUploadRes", mediaUploadRes);
        }
        // Upload all files
        if (finalData.initialContact.captureIdea.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.initialContact.captureIdea.file,
            id: createdChecklist.data.initialContact.captureIdea.id,
            type: "checklist.capture-idea"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.initialContact.caputreContect.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.initialContact.caputreContect.file,
            id: createdChecklist.data.initialContact.caputreContect.id,
            type: "checklist.capture-contect"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparation.inspection.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparation.inspection.file,
            id: createdChecklist.data.preparation.inspection.id,
            type: "checklist.inspection"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparation.captureRequirements.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparation.captureRequirements.file,
            id: createdChecklist.data.preparation.captureRequirements.id,
            type: "checklist.capture-requirements"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparation.captureNeeds.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparation.captureNeeds.file,
            id: createdChecklist.data.preparation.captureNeeds.id,
            type: "checklist.capture-needs"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.fundingResearch.checkDatabase.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.fundingResearch.checkDatabase.file,
            id: createdChecklist.data.fundingResearch.checkDatabase.id,
            type: "checklist.check-database"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.fundingResearch.checkForFunding.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.fundingResearch.checkForFunding.file,
            id: createdChecklist.data.fundingResearch.checkForFunding.id,
            type: "checklist.check-funding"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.fundingResearch.checkWithFunding.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.fundingResearch.checkWithFunding.file,
            id: createdChecklist.data.fundingResearch.checkWithFunding.id,
            type: "checklist.check-with-funding"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.fundingResearch.checkGuildlines.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.fundingResearch.checkGuildlines.file,
            id: createdChecklist.data.fundingResearch.checkGuildlines.id,
            type: "checklist.check-guildlines"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparationOfProject.checkContent.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparationOfProject.checkContent.file,
            id: createdChecklist.data.preparationOfProject.checkContent.id,
            type: "checklist.check-content"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparationOfProject.checkCooperations.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparationOfProject.checkCooperations.file,
            id: createdChecklist.data.preparationOfProject.checkCooperations.id,
            type: "checklist.check-cooperations"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparationOfProject.checkSimilarProejcts.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparationOfProject.checkSimilarProejcts.file,
            id:
              createdChecklist.data.preparationOfProject.checkSimilarProejcts
                .id,
            type: "checklist.check-similar-proejcts"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.preparationOfProject.checkPlanning.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.preparationOfProject.checkPlanning.file,
            id: createdChecklist.data.preparationOfProject.checkPlanning.id,
            type: "checklist.check-planning"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.legitimation.template.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.legitimation.template.file,
            id: createdChecklist.data.legitimation.template.id,
            type: "checklist.template"
          });
          console.log("fileUploadRes", fileUploadRes);
        }

        if (finalData.finalExamination.revision.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.finalExamination.revision.file,
            id: createdChecklist.data.finalExamination.revision.id,
            type: "checklist.revision"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
        if (finalData.finalExamination.signatures.file !== null) {
          const fileUploadRes = await context.dispatch("uploadFiles", {
            files: finalData.finalExamination.signatures.file,
            id: createdChecklist.data.finalExamination.signatures.id,
            type: "checklist.signatures"
          });
          console.log("fileUploadRes", fileUploadRes);
        }
      } catch (error) {
        Notify.create({
          type: "negative",
          message: error.response.data.error.message
        });
      }
      context.commit("addNewChecklist", res.data.data);
      Notify.create({
        message: "Neue Umsetzungscheckliste hinzugefügt",
        type: "positive"
      });
      // context.dispatch("getProjectIdeas");
      this.$router.push({ path: "/dashboard" });
      // this.$router.go(-1);
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
  console.log("payload", payload);
  if (payload.files && payload.id) {
    let formData = new FormData();
    formData.append("ref", payload.type);
    formData.append("refId", payload.id);
    formData.append("field", "file");
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
        formData.append("ref", "api::checklist.checklist");
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
      console.log("item", item);
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

export async function addAndRemoveFiles(newObject, originalObject) {
  let added = [];
  if (originalObject.file === null) {
    console.log("checklist files is null");
    added = newObject.file;
  } else {
    console.log("checklist files is not null");
    added = newObject.file.filter(
      newFiles =>
        !originalObject.file.find(oldFiles => oldFiles.id === newFiles.id)
    );
  }
  let deleted = [];
  if (originalObject.file !== null) {
    deleted = originalObject.file.filter(
      oldFiles => !newObject.file.find(newFiles => newFiles.id === oldFiles.id)
    );
  }
  return {
    added,
    deleted
  };
}

export async function editChecklist(context, payload) {
  const { data } = payload;
  if (!!data) {
    console.log("data", data);
    const initialContact = await constructInitialContact(
      data.items.find(item => item.cardName === "initialContact"),
      true
    );
    const preparation = await constructpreparation(
      data.items.find(item => item.cardName === "preparation"),
      true
    );
    const fundingResearch = await constructFundingResearch(
      data.items.find(item => item.cardName === "fundingResearch"),
      true
    );
    const preparationOfProject = await constructPreparationOfProject(
      data.items.find(item => item.cardName === "preparationOfProject"),
      true
    );
    const legitimation = await constructLegitimation(
      data.items.find(item => item.cardName === "legitimation"),
      true
    );
    const finalExamination = await constructFinalExamination(
      data.items.find(item => item.cardName === "finalExamination"),
      true
    );
    // Remove items property from original object & create new object called finalData
    const { items, ...finalData } = {
      ...data,
      initialContact,
      preparation,
      fundingResearch,
      preparationOfProject,
      legitimation,
      finalExamination
    };
    console.log("finalData", finalData);
    // if (!finalData?.project?.id) {
    //   delete finalData.project;
    // }
    // Delete files and media properties from finalData and add them to finalDataWithoutFiles object
    const dataWithoutFiles = JSON.parse(JSON.stringify(finalData));
    for (const key in dataWithoutFiles) {
      if (
        typeof dataWithoutFiles[key] === "object" &&
        !!dataWithoutFiles[key] &&
        dataWithoutFiles[key].hasOwnProperty("start")
      ) {
        for (const subKey in dataWithoutFiles[key]) {
          delete dataWithoutFiles[key][subKey].file;
        }
      }
    }
    delete dataWithoutFiles.media;
    console.log("dataWithoutFiles", dataWithoutFiles);
    try {
      const res = await api.put(`/api/checklists/${finalData.id}`, {
        data: dataWithoutFiles
      });
      console.log("res :>> ", res);
      try {
        const createdChecklist = await api.get(
          `/api/checklists/${res.data.data.id}`
        );
        // Upload and delete media
        if (finalData.media !== null) {
          let added = [];
          if (context.state.checklist.media === null) {
            added = finalData.media;
          } else {
            added = finalData.media.filter(
              newMedia =>
                !context.state.checklist.media.find(
                  oldMedia => oldMedia.id === newMedia.id
                )
            );
          }
          let deleted = [];
          if (context.state.checklist.media !== null) {
            deleted = context.state.checklist.media.filter(
              oldMedia =>
                !finalData.media.find(newMedia => newMedia.id === oldMedia.id)
            );
          }
          console.log("added", added);
          console.log("deleted", deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadMedia", {
              media: added,
              id: res.data.data.id
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }

        // Upload and Delete files
        if (finalData.initialContact.captureIdea.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.initialContact.captureIdea,
            context.state.checklist.initialContact.captureIdea
          );
          console.log("captureIdea", added, deleted);

          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.initialContact.captureIdea.id,
              type: "checklist.capture-idea"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.initialContact.caputreContect.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.initialContact.caputreContect,
            context.state.checklist.initialContact.caputreContect
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.initialContact.caputreContect.id,
              type: "checklist.capture-contect"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparation.inspection.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparation.inspection,
            context.state.checklist.preparation.inspection
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.preparation.inspection.id,
              type: "checklist.inspection"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparation.captureRequirements.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparation.captureRequirements,
            context.state.checklist.preparation.captureRequirements
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.preparation.captureRequirements.id,
              type: "checklist.capture-requirements"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparation.captureNeeds.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparation.captureNeeds,
            context.state.checklist.preparation.captureNeeds
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.preparation.captureNeeds.id,
              type: "checklist.capture-needs"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.fundingResearch.checkDatabase.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.fundingResearch.checkDatabase,
            context.state.checklist.fundingResearch.checkDatabase
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.fundingResearch.checkDatabase.id,
              type: "checklist.check-database"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.fundingResearch.checkForFunding.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.fundingResearch.checkForFunding,
            context.state.checklist.fundingResearch.checkForFunding
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.fundingResearch.checkForFunding.id,
              type: "checklist.check-funding"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.fundingResearch.checkWithFunding.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.fundingResearch.checkWithFunding,
            context.state.checklist.fundingResearch.checkWithFunding
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.fundingResearch.checkWithFunding.id,
              type: "checklist.check-with-funding"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.fundingResearch.checkGuildlines.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.fundingResearch.checkGuildlines,
            context.state.checklist.fundingResearch.checkGuildlines
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.fundingResearch.checkGuildlines.id,
              type: "checklist.check-guildlines"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparationOfProject.checkContent.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparationOfProject.checkContent,
            context.state.checklist.preparationOfProject.checkContent
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.preparationOfProject.checkContent.id,
              type: "checklist.check-content"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparationOfProject.checkCooperations.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparationOfProject.checkCooperations,
            context.state.checklist.preparationOfProject.checkCooperations
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id:
                createdChecklist.data.preparationOfProject.checkCooperations.id,
              type: "checklist.check-cooperations"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparationOfProject.checkSimilarProejcts.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparationOfProject.checkSimilarProejcts,
            context.state.checklist.preparationOfProject.checkSimilarProejcts
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id:
                createdChecklist.data.preparationOfProject.checkSimilarProejcts
                  .id,
              type: "checklist.check-similar-proejcts"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.preparationOfProject.checkPlanning.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.preparationOfProject.checkPlanning,
            context.state.checklist.preparationOfProject.checkPlanning
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.preparationOfProject.checkPlanning.id,
              type: "checklist.check-planning"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.legitimation.template.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.legitimation.template,
            context.state.checklist.legitimation.template
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.legitimation.template.id,
              type: "checklist.template"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }

        if (finalData.finalExamination.revision.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.finalExamination.revision,
            context.state.checklist.finalExamination.revision
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            const addNewFilesRes = await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.finalExamination.revision.id,
              type: "checklist.revision"
            });
            console.log("addNewFilesRes", addNewFilesRes);
          }
          if (deleted.length > 0) {
            const deleteFilesRes = await context.dispatch(
              "deleteFilesAndMedia",
              {
                data: deleted
                // id: res.data.data.id
              }
            );
            console.log("deleteFilesRes", deleteFilesRes);
          }
        }
        if (finalData.finalExamination.signatures.file !== null) {
          const { added, deleted } = await addAndRemoveFiles(
            finalData.finalExamination.signatures,
            context.state.checklist.finalExamination.signatures
          );
          console.log("caputreContect", added, deleted);
          if (added.length > 0) {
            await context.dispatch("uploadFiles", {
              files: added,
              id: createdChecklist.data.finalExamination.signatures.id,
              type: "checklist.signatures"
            });
          }
          if (deleted.length > 0) {
            await context.dispatch("deleteFilesAndMedia", { data: deleted });
          }
        }
      } catch (error) {
        Notify.create({
          type: "negative",
          message: error.response.data.error.message
        });
      }
      // context.commit("addNewProjectIdea", res.data.data);
      Notify.create({
        message: "Umsetzungscheckliste bearbeitet",
        type: "positive"
      });
      // context.dispatch("getProjectIdeas");
      // this.$router.push({
      //   path: "/user/data?tab=implementationChecklist"
      // });
      this.$router.go(-1);
    } catch (error) {
      console.log("error.response", error.response);
      Notify.create({
        // position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function constructInitialContact(payload, editing) {
  if (payload) {
    let initialContact = {};
    if (!!payload.start) {
      initialContact.start = payload.start;
    }
    if (!!payload.end) {
      initialContact.end = payload.end;
    }
    initialContact.responsiblePerson = payload.responsiblePerson;
    if (editing === true) {
      initialContact.id = payload.id;
    }
    const captureIdea = payload.items.find(
      item => item.objectName === "captureIdea"
    );
    console.log("captureIdea", captureIdea);
    const caputreContect = payload.items.find(
      item => item.objectName === "caputreContect"
    );
    initialContact.captureIdea = {
      ...captureIdea
      // project: !!captureIdea.project?.id ? { id: captureIdea.project.id } : {}
    };
    if (editing === false) {
      if (!initialContact.captureIdea?.project?.id) {
        delete initialContact.captureIdea.project;
      }
    }
    initialContact.caputreContect = {
      ...caputreContect
    };
    if (editing === true) {
      initialContact.captureIdea.id = captureIdea.id;
      initialContact.caputreContect.id = caputreContect.id;
    }
    return initialContact;
  }
}

export async function constructpreparation(payload, editing) {
  if (payload) {
    let preparation = {};
    if (!!payload.start) {
      preparation.start = payload.start;
    }
    preparation.responsiblePerson = payload.responsiblePerson;
    if (!!payload.end) {
      preparation.end = payload.end;
    }
    if (editing === true) {
      preparation.id = payload.id;
    }
    const inspection = payload.items.find(
      item => item.objectName === "inspection"
    );
    const captureRequirements = payload.items.find(
      item => item.objectName === "captureRequirements"
    );
    const captureNeeds = payload.items.find(
      item => item.objectName === "captureNeeds"
    );
    preparation.inspection = {
      ...inspection
    };
    preparation.captureRequirements = {
      ...captureRequirements
    };
    preparation.captureNeeds = {
      ...captureNeeds
    };
    if (editing === true) {
      preparation.inspection.id = inspection.id;
      preparation.captureRequirements.id = captureRequirements.id;
      preparation.captureNeeds.id = captureNeeds.id;
    }
    return preparation;
  }
}

export async function constructFundingResearch(payload, editing) {
  if (payload) {
    let fundingResearch = {};
    if (!!payload.start) {
      fundingResearch.start = payload.start;
    }
    fundingResearch.responsiblePerson = payload.responsiblePerson;
    if (!!payload.end) {
      fundingResearch.end = payload.end;
    }
    if (editing === true) {
      fundingResearch.id = payload.id;
    }
    const checkDatabase = payload.items.find(
      item => item.objectName === "checkDatabase"
    );
    const checkForFunding = payload.items.find(
      item => item.objectName === "checkForFunding"
    );
    const checkWithFunding = payload.items.find(
      item => item.objectName === "checkWithFunding"
    );
    const checkGuildlines = payload.items.find(
      item => item.objectName === "checkGuildlines"
    );
    const selectFunding = payload.items.find(
      item => item.objectName === "selectFunding"
    );
    fundingResearch.checkDatabase = {
      ...checkDatabase
    };
    fundingResearch.checkForFunding = {
      ...checkForFunding
    };
    fundingResearch.checkWithFunding = {
      ...checkWithFunding
    };
    fundingResearch.checkGuildlines = {
      ...checkGuildlines
    };
    fundingResearch.selectFunding = {
      ...selectFunding
    };
    if (editing === true) {
      fundingResearch.checkDatabase.id = checkDatabase.id;
      fundingResearch.checkForFunding.id = checkForFunding.id;
      fundingResearch.checkWithFunding.id = checkWithFunding.id;
      fundingResearch.checkGuildlines.id = checkGuildlines.id;
      fundingResearch.selectFunding.id = selectFunding.id;
    }
    return fundingResearch;
  }
}

export async function constructPreparationOfProject(payload, editing) {
  if (payload) {
    let preparationOfProject = {};
    if (!!payload.start) {
      preparationOfProject.start = payload.start;
    }
    preparationOfProject.responsiblePerson = payload.responsiblePerson;
    if (!!payload.end) {
      preparationOfProject.end = payload.end;
    }
    if (editing === true) {
      preparationOfProject.id = payload.id;
    }
    const checkContent = payload.items.find(
      item => item.objectName === "checkContent"
    );
    const checkCooperations = payload.items.find(
      item => item.objectName === "checkCooperations"
    );
    const checkSimilarProejcts = payload.items.find(
      item => item.objectName === "checkSimilarProejcts"
    );
    const checkPlanning = payload.items.find(
      item => item.objectName === "checkPlanning"
    );
    preparationOfProject.checkContent = {
      ...checkContent
    };
    preparationOfProject.checkCooperations = {
      ...checkCooperations
    };
    preparationOfProject.checkSimilarProejcts = {
      ...checkSimilarProejcts
    };
    preparationOfProject.checkPlanning = {
      ...checkPlanning
    };
    if (editing === true) {
      preparationOfProject.checkContent.id = checkContent.id;
      preparationOfProject.checkCooperations.id = checkCooperations.id;
      preparationOfProject.checkSimilarProejcts.id = checkSimilarProejcts.id;
      preparationOfProject.checkPlanning.id = checkPlanning.id;
    }
    return preparationOfProject;
  }
}

export async function constructLegitimation(payload, editing) {
  if (payload) {
    let legitimation = {};
    if (!!payload.start) {
      legitimation.start = payload.start;
    }
    legitimation.responsiblePerson = payload.responsiblePerson;
    if (!!payload.end) {
      legitimation.end = payload.end;
    }
    if (editing === true) {
      legitimation.id = payload.id;
    }
    const template = payload.items.find(item => item.objectName === "template");
    legitimation.template = {
      ...template
    };
    if (editing === true) {
      legitimation.template.id = template.id;
    }
    return legitimation;
  }
}

export async function constructFinalExamination(payload, editing) {
  if (payload) {
    let finalExamination = {};
    if (!!payload.start) {
      finalExamination.start = payload.start;
    }
    finalExamination.responsiblePerson = payload.responsiblePerson;
    if (!!payload.end) {
      finalExamination.end = payload.end;
    }
    if (editing === true) {
      finalExamination.id = payload.id;
    }
    const revision = payload.items.find(item => item.objectName === "revision");
    const signatures = payload.items.find(
      item => item.objectName === "signatures"
    );
    finalExamination.revision = {
      ...revision
    };
    finalExamination.signatures = {
      ...signatures
    };
    if (editing === true) {
      finalExamination.revision.id = revision.id;
      finalExamination.signatures.id = signatures.id;
    }
    return finalExamination;
  }
}

export async function getSpecificChecklist(context, payload) {
  context.commit("setSpecificChecklist", null);
  const { id } = payload;
  if (id) {
    try {
      const res = await api.get(`/api/checklists/${id}`);
      context.commit("setSpecificChecklist", res.data);
      // return res.data.id;
    } catch (error) {
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
          checklist: {
            id: id
          },
          type: type,
          guest: guest
        }
      });
      Notify.create({
        message: "Zugangsanfrage zur Umsetzungscheckliste gesendet",
        type: "positive"
      });
      context.dispatch("getChecklists");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function archiveChecklist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.put(`/api/checklists/${id}`, {
        data: { archived: true }
      });
      console.log("res", res);
      Notify.create({
        message: "Umsetzungscheckliste erfolgreich archiviert",
        type: "positive"
      });
      context.commit("archiveChecklist");
      context.dispatch("getChecklists");
    } catch (error) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function duplicateChecklist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.post(`/api/checklist/duplicate/${id}`);
      Notify.create({
        message: "Umsetzungscheckliste erfolgreich dupliziert",
        type: "positive"
      });
      context.dispatch("getChecklists");
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

export async function addToWatchlist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.post("/api/watchlists", {
        data: { checklist: id }
      });
      console.log("res", res);
      Notify.create({
        message: "Umsetzungscheckliste erfolgreich zur Merkliste zugefügt",
        type: "positive"
      });
      context.dispatch("getChecklists");
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
        message: "Umsetzungscheckliste erfolgreich von der Merkliste entfernt",
        type: "positive"
      });
      context.dispatch("getChecklists");
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function deleteChecklist(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/checklists/${id}`);
      context.commit("deleteChecklist", res.data.data && res.data.data.id);
      Notify.create({
        message: "Umsetzungscheckliste erfolgreich gelöscht",
        type: "positive"
      });
      context.dispatch("getChecklists");
    } catch (error) {
      Notify.create({
        position: "top-right",
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}
