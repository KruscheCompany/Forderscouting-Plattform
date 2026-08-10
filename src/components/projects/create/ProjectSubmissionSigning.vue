<template>
  <div>
    <q-card class="shadow-1 radius-20">
      <q-expansion-item class="shadow-1 overflow-hidden radius-20"
        :label="$t('projectComponents.submissionSigning.title')" header-class="bg-white text-black"
        v-model="expandedSubmissionSigning">
        <q-card-section class="q-pt-none">

          <div class="col-12 q-mt-md">
            <div class="q-gutter-sm">
              <q-radio v-model="status" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="sentToFunding"
                :label="$t('projectComponents.submissionSigning.sentToFunding')" />
              <q-radio v-model="status" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="grantNotice"
                :label="$t('projectComponents.submissionSigning.grantNotice')" />
              <q-radio v-model="status" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="rejectionNotice"
                :label="$t('projectComponents.submissionSigning.rejectionNotice')" />
            </div>
          </div>
        </q-card-section>
      </q-expansion-item>
    </q-card>


  </div>
</template>

<script>
export default {
  name: "ProjectSubmissionSigning",
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
      expandedSubmissionSigning: this.currentTab === "submissionSigning",
      status: this.projectData.status !== undefined ? this.projectData.status : null,
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: true },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: true },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: true },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ],
      tabs: [
        {
          done: false,
          name: "aiFundingCheck",
          title: "AI funding check"
        },
        {
          done: false,
          name: "projectDevelopment",
          title: "Project development"
        },
        {
          done: false,
          name: "application",
          title: "application"
        }
      ]
    };
  },
  computed: {
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'submissionSigning'
      this.expandedSubmissionSigning = newTab === "submissionSigning";
    }
  },
  methods: {
    // Handle toggle change to move from null state to a selected state
    handleToggleChange(newVal) {
      // If status was null before, make sure it now has a value
      if (this.status === null) {
        this.status = newVal;
      }
    },

    // Get updated steps with submissionSigning marked based on status
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'submissionSigning') {
          // Mark submissionSigning as done only if status is not null
          return { ...step, done: this.status !== null };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    // Get updated tabs with application marked based on status
    getUpdatedTabs() {
      // Use existing tabs from projectData if available, otherwise use default tabs
      const currentTabs = this.projectData.applicationProcessSteps || this.tabs;

      return currentTabs.map(tab => {
        if (tab.name === 'application') {
          // Mark application tab as done only if status is not null
          return { ...tab, done: this.status !== null };
        }
        // Keep all other tabs as they are
        return { ...tab };
      });
    },

    async submitSubmissionSigning() {
      if (this.status === null) {
        this.$store.dispatch("notifications/pushToast", { kind: "warning", title: this.$t('projectComponents.submissionSigning.noSelectionError') });
        return;
      }

      try {
        // Get the updated steps and tabs
        const updatedSteps = this.getUpdatedSteps();
        const updatedTabs = this.getUpdatedTabs();

        // Update the local state first
        await this.$store.dispatch('project/updateLocalProjectState', {
          data: {
            status: this.status,
            projectApplicationSteps: updatedSteps,
            applicationProcessSteps: updatedTabs
          }
        });

        // Then persist to the backend
        await this.$store.dispatch('project/simpleUpdateProjectIdea', {
          data: {
            id: this.createdProjectId,
            status: this.status,
            projectApplicationSteps: updatedSteps,
            applicationProcessSteps: updatedTabs
          }
        });

        this.$emit("submissionSigning-submitted", this.status);

        this.$store.dispatch("notifications/pushToast", { kind: "positive", title: this.$t('projectComponents.submissionSigning.successMessage') });
      } catch (error) {
        console.error('Error submitting submission signing:', error);
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t('projectComponents.submissionSigning.errorMessage') });
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
