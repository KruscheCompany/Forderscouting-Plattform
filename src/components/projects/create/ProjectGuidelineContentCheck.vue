<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.guidelineContentCheck.title')"
      header-class="bg-white text-black" v-model="expandedGuidelineContentCheck">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineContentCheck.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="guidelineContentCheck" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGuidelineContentCheck",
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
      expandedGuidelineContentCheck: this.currentTab === "guidelineContentCheck",
      guidelineContentCheck: this.projectData.details.guidelineContentCheck || "",
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: false },
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
      // Expand the section if the current tab is 'guidelineContentCheck'
      this.expandedGuidelineContentCheck = newTab === "guidelineContentCheck";
    }
  },
  methods: {
    // Get updated steps with guidelineContentCheck marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'guidelineContentCheck') {
          // Mark guidelineContentCheck as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitGuidelineContentCheck() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            guidelineContentCheck: this.guidelineContentCheck
          },
          projectApplicationSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("guidelineContentCheck-submitted");
    }
  }
}
</script>

<style lang="scss" scoped></style>
