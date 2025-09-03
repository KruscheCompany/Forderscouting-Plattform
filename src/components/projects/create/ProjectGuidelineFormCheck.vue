<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20"
      :label="$t('projectComponents.guidelineFormCheck.title')" header-class="bg-white text-black"
      v-model="expandedGuidelineFormCheck">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineFormCheck.bulletPointTitle') }}
        </h4>
        <ul>
          <li>{{ $t('projectComponents.guidelineFormCheck.documents') }}</li>
          <li>{{ $t('projectComponents.guidelineFormCheck.procedure') }}</li>
          <li>{{ $t('projectComponents.guidelineFormCheck.applicationDeadline') }}</li>
          <li>{{ $t('projectComponents.guidelineFormCheck.applicationCost') }}</li>
        </ul>
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineFormCheck.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="guidelineFormCheck" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGuidelineFormCheck",
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
      expandedGuidelineFormCheck: this.currentTab === "guidelineFormCheck",
      guidelineFormCheck: this.projectData.details.guidelineFormCheck || "",
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: true },
        { name: 'guidelineFormCheck', title: 'Guideline Check (Formalities)', icon: 'mdi-format-list-checks', done: false },
        { name: 'financingCheck', title: 'Financing Check', icon: 'mdi-cash-check', done: false },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: false },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: false },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'guidelineFormCheck'
      this.expandedGuidelineFormCheck = newTab === "guidelineFormCheck";
    }
  },
  methods: {
    // Get updated steps with guidelineFormCheck marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'guidelineFormCheck') {
          // Mark guidelineFormCheck as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitGuidelineFormCheck() {
      try {
        const updatedSteps = this.getUpdatedSteps();

        await this.$store.dispatch('project/simpleUpdateProjectIdea', {
          data: {
            id: this.createdProjectId,
            details: {
              id: this.projectData.details.id,
              guidelineFormCheck: this.guidelineFormCheck
            },
            projectApplicationSteps: updatedSteps
          }
        });
        this.$emit("guidelineFormCheck-submitted");
      } catch (error) {
        console.error("Error updating project idea:", error);
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
