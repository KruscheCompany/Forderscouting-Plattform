<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.documentsCoordination.title')"
      header-class="bg-white text-black" v-model="expandedDocumentsCoordination">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.documentsCoordination.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="documentsCoordination" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectDocumentsCoordination",
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
      expandedDocumentsCoordination: this.currentTab === "projectDocumentsCoordination",
      documentsCoordination: this.projectData.details && this.projectData.details.documentsCoordination || "",
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: true },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: false },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: false },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'projectDocumentsCoordination'
      this.expandedDocumentsCoordination = newTab === "projectDocumentsCoordination";
    }
  },
  methods: {
    // Get updated steps with projectDocumentsCoordination marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'projectDocumentsCoordination') {
          // Mark projectDocumentsCoordination as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitDocumentsCoordination() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            documentsCoordination: this.documentsCoordination
          },
          projectApplicationSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("documentsCoordination-submitted");
    }
  }
}
</script>

<style lang="scss" scoped></style>
