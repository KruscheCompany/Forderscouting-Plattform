<template>
  <q-page class="q-mt-lg bg-blue-1" :class="$q.screen.gt.sm ? 'q-mx-md' : 'q-mx-sm'">
    <div class="">
      <q-toolbar class="bg-blue text-white shadow-2 radius-top-20">
        <q-tabs v-model="tab" shrink stretch active-color="yellow" content-class="custom-borders">
          <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="$t(tab.label)" />
        </q-tabs>
      </q-toolbar>
    </div>
    <div>
      <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated class="radius-bottom-20 shadow-2">
        <q-step v-for="(step, index) in steps" :key="index" :name="step.name" :title="$t(step.title)" :icon="step.icon"
          :done="step.done && !step.skip" :header-nav="step.done && !step.skip" />
      </q-stepper>
    </div>

    <ProjectDescriptionCreate ref="projectDescriptionRef" :current-tab="step" @project-created="handleProjectCreated" />

    <ProjectFundingCheckCreate ref="fundingCheckRef" class="q-my-md" :current-tab="step" :project-data="form"
      :created-project-id="createdProjectId" @funding-submitted="handleFundingSubmitted"
      v-if="step !== 'project' && step !== 'qAndA'" />

    <ProjectQAndACreate ref="qAndARef" v-if="step !== 'project' && step !== 'fundingCheck' && !skipQuestions"
      :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
      @q-and-a-submitted="handleQAndASubmitted" />

    <ProjectAptitudeCreate ref="aptitudeRef" v-if="step !== 'project' && step !== 'fundingCheck' && step !== 'qAndA'"
      :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
      @aptitude-submitted="handleAptitudeSubmitted" />

    <ProjectDecisionCreate ref="decisionRef" v-if="step === 'decision'" :created-project-id="createdProjectId"
      :project-data="form" :current-tab="step" class="q-my-md" @decision-submitted="handleDecisionSubmitted" />

    <!-- Submit Button -->
    <div class="q-mt-lg q-mb-xl">
      <q-card class="shadow-1 radius-20 bg-white q-pa-lg">
        <div class="row justify-center">
          <q-btn :loading="isLoading" @click="manageSubmit" size="16px" color="primary"
            class="text-white q-px-xl q-py-sm full-width" no-caps :label="$t('Publish')" />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import ProjectDescriptionCreate from 'src/components/projects/create/ProjectDescriptionCreate.vue';
import ProjectFundingCheckCreate from 'src/components/projects/create/ProjectFundingCheckCreate.vue';
import ProjectQAndACreate from 'src/components/projects/create/ProjectQAndACreate.vue';
import ProjectAptitudeCreate from 'src/components/projects/create/ProjectAptitudeCreate.vue';
import ProjectDecisionCreate from 'src/components/projects/create/ProjectDecisionCreate.vue';

export default {
  name: "ApplicationProcessPage",
  components: {
    ProjectDescriptionCreate,
    ProjectFundingCheckCreate,
    ProjectQAndACreate,
    ProjectAptitudeCreate,
    ProjectDecisionCreate
  },
  data() {
    return {
      step: 'project',
      tab: 'tab1',
      secondaryTab: 'project',
      isLoading: false,
      editing: true,
      createdProjectId: null, // Store the project ID after creation
      form: {}, // Store project data for passing to child components
      tabs: [
        { name: 'tab1', label: 'AI funding check' },
        { name: 'tab2', label: 'Project development' },
        { name: 'tab3', label: 'application' }
      ],
      steps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: false },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: false },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: false },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ],
    };
  },
  computed: {
    project() {
      return this.$store.getters["project/getProject"];
    },
    fundingMatches() {
      return this.$store.getters["ai/getFundingMatches"];
    },
    isLoadingFundingMatches() {
      return this.$store.getters["ai/getLoadingFundingMatches"];
    },
    skipQuestions() {
      return this.steps.some(step => step.skip);
    }
  },
  methods: {
    goToPreviousStep() {
      const currentIndex = this.steps.findIndex(s => s.name === this.step);
      if (currentIndex > 0) {
        this.step = this.steps[currentIndex - 1].name;
      }
    },
    goToNextStep(skip) {
      const skipper = skip ? 2 : 1
      const currentIndex = this.steps.findIndex(s => s.name === this.step);
      if (currentIndex < this.steps.length - 1) {
        if (skipper > 1) {
          this.steps[currentIndex + 1].skip = true;
        } else {
          this.steps[currentIndex + 1].skip = false;
        }
        this.step = this.steps[currentIndex + skipper].name;
        // Mark current step as done
        this.steps[currentIndex].done = true;
      }
    },
    handleProjectCreated(data) {
      const { hasStartingConditionChanged } = data;
      this.createdProjectId = data.id;
      this.form = { ...this.form, ...data.projectData };

      if (hasStartingConditionChanged || !this.form.fundingMatches) {
        this.handleFundingMatch(data.projectData);
      } else {
        this.step = 'fundingCheck';
      }
    },
    async handleFundingMatch(projectData) {
      try {
        await this.$store.dispatch('ai/matchFunding', {
          projectData: projectData.details.startingCondition
        });

        this.step = 'fundingCheck';

      } catch (fundingError) {
        console.error('Funding matching failed:', fundingError);
        this.step = 'fundingCheck';
      }
    },
    async handleFundingSubmitted(data) {
      const { noChange, noneSelected } = data;
      console.log("🚀 ~ handleFundingSubmitted ~ noneSelected:", noneSelected)

      if (!noChange) {
        this.form.fundingMatches = data.fundingMatches;
      }

      if (noneSelected) {
        this.steps = this.steps.map(step => {
          if (step.name === 'qAndA') {
            return { ...step, skip: true };
          }
          return step;
        });
      }

      // Move to next step
      this.goToNextStep(noneSelected);
      if (!noneSelected && (!noChange || this.project.questions === null)) {
        const selectedFunding = data.fundingMatches.find(funding => funding.selected);
        await this.$store.dispatch('ai/getFundingQuestions', { fundingId: selectedFunding._id, idea: this.form.details.startingCondition });
      }
    },
    async handleQAndASubmitted() {
      this.goToNextStep();
    },
    async handleAptitudeSubmitted() {
      this.goToNextStep();
    },
    async handleDecisionSubmitted(decision) {
      // Move to next step
      // this.goToNextStep();
    },
    async manageSubmit() {
      if (this.step === 'project') {
        await this.$refs.projectDescriptionRef.submitProject(this.steps);
      }
      else if (this.step === 'fundingCheck') {
        await this.$refs.fundingCheckRef.submitFundingCheck();
      }
      else if (this.step === 'qAndA') {
        await this.$refs.qAndARef.submitQAndA();
      }
      else if (this.step === 'aptitude') {
        await this.$refs.aptitudeRef.submitAptitude();
      }
      else if (this.step === 'decision') {
        await this.$refs.decisionRef.submitDecision();
      }
    },
    async setData() {
      if (!!this.$route.params && this.$route.params.projectId) {
        const id = Number(this.$route.params.projectId);
        this.createdProjectId = id;
        this.editing = true;
        this.$q.loading.show();
        await this.$store.dispatch("project/getSpecificProject", {
          id: id,
        });
        this.form = {
          ...this.form,
          ...JSON.parse(
            JSON.stringify({
              ...this.project,
            })
          ),
        };
        this.$q.loading.hide();
        this.$refs.projectDescriptionRef.setData();
      }
      this.$store.dispatch("userCenter/getUsers");
      this.steps = this.form.fundingCheckSteps || this.steps;
    },
  },
  mounted() {
    this.setData();
  },
  beforeDestroy() {
    this.$q.loading.hide();
  },
};
</script>

<style lang="scss">
.custom-borders {
  .q-tab:not(:first-child)::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0%;
    width: 2px;
    height: 40%;
    background-color: $grey;
  }

  &-secondary {
    .q-tab:not(:first-child)::before {
      content: '>';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -5px;
      width: 2px;
      height: 50%;
      color: gray;
    }
  }
}

.circle-indicator {
  display: inline-block;
  min-width: 18px;
  min-height: 18px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  vertical-align: middle;
}

.circle-indicator-outlined {
  display: inline-block;
  min-width: 18px;
  min-height: 18px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid $grey;
  vertical-align: middle;
  background-color: transparent;
}

.fundingCheckTabs:hover>.q-focus-helper {
  background-color: transparent !important;
}

.q-stepper__header--border {
  border: 0
}

[dir] .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0;
}

.toggleGap {
  gap: 15px;

  >button {
    border-radius: 10px !important;
    border: 1px solid $yellow;
  }
}

.flexWrap {
  flex-wrap: wrap !important;
}

.disabledClass {
  .q-field__inner .q-field__control input {
    color: black;
    opacity: 1 !important;
  }

  .q-field__inner .q-field__control:before {
    border-color: $primary;
  }
}
</style>
