<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.guidelineContentCheck.title')"
      header-class="bg-white text-black" v-model="expandedGuidelineContentCheck">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineContentCheck.bulletPointTitle') }}
        </h4>
        <ul>
          <li>{{ $t('projectComponents.guidelineContentCheck.documents') }}</li>
          <li>{{ $t('projectComponents.guidelineContentCheck.procedure') }}</li>
          <li>{{ $t('projectComponents.guidelineContentCheck.applicationDeadline') }}</li>
          <li>{{ $t('projectComponents.guidelineContentCheck.applicationCost') }}</li>
        </ul>
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineContentCheck.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="guidelineCheck" />
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
      guidelineCheck: this.projectData.details.guidelineCheck || "",
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: false },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: false },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: false },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      this.expandedGuidelineContentCheck = newTab === "guidelineContentCheck";
    }
  },
  methods: {
    getUpdatedSteps() {
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'guidelineContentCheck') {
          return { ...step, done: true };
        }
        return { ...step };
      });
    },

    async submitGuidelineContentCheck() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            guidelineCheck: this.guidelineCheck
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
