<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20"
      :label="currentTab === 'applicationDecision' ? $t('projectComponents.applicationDecision.title') : $t('projectComponents.guidelineContentCheck.uploadsTitle')"
      header-class="bg-white text-black" v-model="expandedApplicationDecision">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ currentTab === 'applicationDecision' ? $t('projectComponents.applicationDecision.description') :
            $t('projectComponents.guidelineContentCheck.uploadsDescription') }}
        </h4>

        <div class="col-12 q-mt-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-file flat v-model="applicationDecisionFiles" class="uploadInput input-radius-6 text-white"
                label-color="white" dark bg-color="primary" :label="!!applicationDecisionFiles && applicationDecisionFiles.length > 0
                  ? $t('Add Files')
                  : $t('Select Files')
                  " multiple display-value="" append>
                <template v-slot:prepend>
                  <q-icon color="white" class="on-right" name="upload" />
                </template>
              </q-file>
              <div class="q-mt-sm" v-if="applicationDecisionFiles && applicationDecisionFiles.length > 0">
                <q-item class="radius-6 shadow-1 q-mb-sm" v-for="(file, index) in applicationDecisionFiles" :key="index"
                  clickable>
                  <q-item-section side>
                    <q-avatar rounded size="48px">
                      <q-icon name="insert_drive_file" size="24px" color="primary" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="ellipsis" caption>{{
                      filePreview(file).name
                      }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn icon="delete" @click.prevent.stop="removeFile(index)" size="sm" round text-color="red"
                      flat />
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import { api } from "boot/axios";

export default {
  name: "ProjectApplicationDecision",
  props: {
    projectData: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    },
    createdProjectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      expandedApplicationDecision: this.currentTab === "applicationDecision" || this.currentTab === "guidelineContentCheck",
      // Create a deep copy to avoid direct store mutations
      applicationDecisionFiles: this.projectData && this.projectData.applicationDecisionFiles !== undefined ?
        JSON.parse(JSON.stringify(this.projectData.applicationDecisionFiles)) : null,
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: true },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: true },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: false },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'applicationDecision'
      this.expandedApplicationDecision = newTab === "applicationDecision";
    },
    // Watch for changes in the projectData to update local data
    projectData: {
      handler(newProjectData) {
        // Update applicationDecisionFiles when projectData changes
        if (newProjectData && newProjectData.applicationDecisionFiles !== undefined) {
          // Create a deep copy to avoid direct store mutations
          this.applicationDecisionFiles = JSON.parse(JSON.stringify(newProjectData.applicationDecisionFiles));
        }
      },
      deep: true // Watch for nested changes in the object
    }
  },
  methods: {
    // Refresh data from the server
    async refreshData() {
      // Only refresh if we have a project ID
      if (this.createdProjectId) {
        try {
          // Fetch the latest project data
          const result = await this.$store.dispatch("project/getSpecificProject", {
            id: this.createdProjectId,
          });

          // Update local files array with fresh data
          const currentProject = this.$store.getters["project/getProject"];
          if (currentProject && currentProject.applicationDecisionFiles !== undefined) {
            // Create a deep copy to avoid direct store mutations
            this.applicationDecisionFiles = JSON.parse(JSON.stringify(currentProject.applicationDecisionFiles));
          }
        } catch (error) {
          console.error("Error refreshing application decision files:", error);
        }
      }
    },

    // Get file preview information
    filePreview(file) {
      return {
        url: !!file.id ? `${this.appUrl}${file.url}` : URL.createObjectURL(file),
        name: file.name
      };
    },

    // Remove file from the list
    removeFile(index) {
      if (this.applicationDecisionFiles) {
        const file = this.applicationDecisionFiles[index];

        // If the file has an ID (already uploaded), delete it from the server
        if (file && file.id) {
          this.deleteFileFromServer(file);
        }

        // Remove from local array
        this.applicationDecisionFiles.splice(index, 1);
      }
    },

    // Delete file from server
    async deleteFileFromServer(file) {
      try {
        await api.delete(`api/upload/files/${file.id}`);
      } catch (error) {
        console.error("Error deleting file:", error);
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: error.response?.data?.error?.message || "Error deleting file" });
      }
    },

    // Get updated steps with applicationDecision marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'applicationDecision') {
          // Mark applicationDecision as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitApplicationDecision() {
      try {
        // Handle file uploads first if there are any files to upload
        if (this.applicationDecisionFiles && this.applicationDecisionFiles.length > 0) {
          // Filter files that don't already have IDs (new uploads)
          const newFiles = this.applicationDecisionFiles.filter(file => !file.id);
          const existingFiles = this.applicationDecisionFiles.filter(file => file.id);

          if (newFiles.length > 0) {
            // Create FormData for file upload
            let formData = new FormData();
            formData.append("ref", "api::project.project");
            formData.append("refId", this.createdProjectId);
            formData.append("field", "applicationDecisionFiles");

            // Append each file to the form data
            if (newFiles.length > 1) {
              newFiles.forEach(file => {
                formData.append("files", file);
              });
            } else {
              formData.append("files", newFiles[0]);
            }

            // Upload the files
            await api.post("api/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });

            // Refresh the data to get the uploaded files with proper IDs
            await this.$store.dispatch("project/getSpecificProject", {
              id: this.createdProjectId,
            });

            // Get the refreshed project with updated files
            const currentProject = this.$store.getters["project/getProject"];
            if (currentProject && currentProject.applicationDecisionFiles) {
              // Now update the steps with only valid server files
              const updateResult = await this.$store.dispatch('project/simpleUpdateProjectIdea', {
                data: {
                  id: this.createdProjectId,
                  projectApplicationSteps: this.getUpdatedSteps()
                }
              });
            }
          } else {
            // If there are only existing files, just update the steps
            const updateResult = await this.$store.dispatch('project/simpleUpdateProjectIdea', {
              data: {
                id: this.createdProjectId,
                projectApplicationSteps: this.getUpdatedSteps()
              }
            });
          }
        } else {
          // If there are no files at all, just update the steps
          const updateResult = await this.$store.dispatch('project/simpleUpdateProjectIdea', {
            data: {
              id: this.createdProjectId,
              projectApplicationSteps: this.getUpdatedSteps()
            }
          });
        }

        // Refresh the data after all operations to get the latest state
        await this.refreshData();

        // Emit event to move to next step
        this.$emit("applicationDecision-submitted");
      } catch (error) {
        console.error("Error submitting application decision:", error);
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: error.response?.data?.error?.message || "Error uploading files" });
      }
    }
  },
  computed: {
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    }
  },

  mounted() {
    // Refresh data when component is mounted
    this.refreshData();
  },

  activated() {
    // Refresh data when component is re-activated
    this.refreshData();
  }
}
</script>

<style lang="scss" scoped>
.uploadInput {
  border-radius: 6px;
  overflow: hidden;
}
</style>
