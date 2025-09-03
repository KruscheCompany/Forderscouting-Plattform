<template>
  <q-page class="q-mt-lg bg-blue-1" :class="$q.screen.gt.sm ? 'q-mx-md' : 'q-mx-sm'">
    <div class="">
      <q-toolbar class="bg-blue text-white shadow-2 radius-top-20">
        <q-tabs v-model="tab" shrink stretch active-color="yellow" content-class="custom-borders" inline-label
          @input="setActiveStepBasedOnCompletion">
          <q-tab v-for="(tab, index) in tabs" :key="tab.name" :name="tab.name" :label="$t(tab.title)"
            :icon="tab.done ? 'mdi-check-all' : ''" :disable="shouldDisableTab(index)" />
        </q-tabs>
      </q-toolbar>
    </div>
    <div>
      <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated class="radius-bottom-20 shadow-2">
        <q-step v-for="(step, index) in steps" :key="index" :name="step.name" :title="$t(step.title)" :icon="step.icon"
          :done="step.done && !step.skip" :header-nav="step.done && !step.skip" />
      </q-stepper>
    </div>

    <div v-if="tab === 'aiFundingCheck'">
      <ProjectDescriptionCreate v-if="step === 'project'" ref="projectDescriptionRef" :current-tab="step"
        @project-created="handleProjectCreated" />

      <ProjectViewGeneralInfo v-if="step !== 'project'" :project="form" :current-tab="step" />
      <ProjectViewContentDetails v-if="step !== 'project'" :project="form" :current-tab="step" class="q-my-md" />

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
    </div>

    <div v-if="tab === 'projectDevelopment'">
      <ProjectViewGeneralInfo :project="form" :current-tab="step" />
      <ProjectViewContentDetails :project="form" :current-tab="step" class="q-my-md" />
      <ProjectTaskPlanCreate ref="taskPlanRef" v-if="step === 'taskPlan'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @taskPlan-submitted="goToNextStep(false)" />

      <ProjectSiteVisit ref="siteVisitRef" v-if="step === 'siteVisit'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @siteVisit-submitted="goToNextStep(false)" />

      <ProjectGoals ref="goalsRef" v-if="step === 'goals'" :created-project-id="createdProjectId" :project-data="form"
        :current-tab="step" class="q-my-md" @goals-submitted="goToNextStep(false)" />

      <ProjectRequirements ref="requirementsRef" v-if="step === 'requirements'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @requirements-submitted="goToNextTab" />
    </div>

    <div v-if="tab === 'application'">
      <ProjectViewGeneralInfo :project="form" :current-tab="step" />
      <ProjectViewContentDetails :project="form" :current-tab="step" class="q-my-md" />

      <ProjectGuidelineContentCheck ref="guidelineContentCheckRef" v-if="step === 'guidelineContentCheck'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @guidelineContentCheck-submitted="goToNextStep(false)" />

      <ProjectGuidelineFormCheck ref="guidelineFormCheckRef" v-if="step === 'guidelineFormCheck'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @guidelineFormCheck-submitted="goToNextStep(false)" />

      <ProjectFinancingCheck ref="financingCheckRef" v-if="step === 'financingCheck'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @financingCheck-submitted="goToNextStep(false)" />

      <ProjectDocumentsCoordination ref="documentsCoordinationRef" v-if="step === 'projectDocumentsCoordination'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @documentsCoordination-submitted="goToNextStep(false)" />

      <ProjectApplicationDecision ref="applicationDecisionRef" v-if="step === 'applicationDecision'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @applicationDecision-submitted="goToNextStep(false)" />

      <!-- Always show application decision files in the submissionSigning step -->
      <ProjectViewApplicationDecision v-if="step === 'submissionSigning'" :project="form" :current-tab="step"
        class="q-my-md" />

      <!-- Then show the submission signing choices -->
      <ProjectSubmissionSigning ref="submissionSigningRef" v-if="step === 'submissionSigning'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @submissionSigning-submitted="handleSubmissionSigningSubmitted" />


    </div>

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
import ProjectTaskPlanCreate from 'src/components/projects/create/ProjectTaskPlanCreate.vue';
import ProjectSiteVisit from 'src/components/projects/create/ProjectSiteVisit.vue';
import ProjectGoals from 'src/components/projects/create/ProjectGoals.vue';
import ProjectRequirements from 'src/components/projects/create/ProjectRequirements.vue';
import ProjectGuidelineContentCheck from 'src/components/projects/create/ProjectGuidelineContentCheck.vue';
import ProjectGuidelineFormCheck from 'src/components/projects/create/ProjectGuidelineFormCheck.vue';
import ProjectFinancingCheck from 'src/components/projects/create/ProjectFinancingCheck.vue';
import ProjectDocumentsCoordination from 'src/components/projects/create/ProjectDocumentsCoordination.vue';
import ProjectApplicationDecision from 'src/components/projects/create/ProjectApplicationDecision.vue';
import ProjectSubmissionSigning from 'src/components/projects/create/ProjectSubmissionSigning.vue';

import ProjectViewGeneralInfo from 'src/components/projects/view/ProjectGeneralInfo.vue';
import ProjectViewContentDetails from 'src/components/projects/view/ProjectContentDetails.vue';
import ProjectViewApplicationDecision from 'src/components/projects/view/ProjectApplicationDecision.vue';


export default {
  name: "ApplicationProcessPage",
  components: {
    ProjectDescriptionCreate,
    ProjectFundingCheckCreate,
    ProjectQAndACreate,
    ProjectAptitudeCreate,
    ProjectDecisionCreate,
    ProjectTaskPlanCreate,
    ProjectSiteVisit,
    ProjectGoals,
    ProjectRequirements,
    ProjectGuidelineContentCheck,
    ProjectGuidelineFormCheck,
    ProjectFinancingCheck,
    ProjectDocumentsCoordination,
    ProjectApplicationDecision,
    ProjectSubmissionSigning,
    ProjectViewGeneralInfo,
    ProjectViewContentDetails,
    ProjectViewApplicationDecision
  },
  data() {
    return {
      step: 'project',
      tab: 'aiFundingCheck',
      secondaryTab: 'project',
      isLoading: false,
      editing: true,
      createdProjectId: null, // Store the project ID after creation
      form: {}, // Store project data for passing to child components
      fundingCheckSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: false },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: false },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: false },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ],
      projectDevelopmentSteps: [
        { name: 'taskPlan', title: 'task plan', icon: 'mdi-checkbox-multiple-marked', done: false },
        { name: 'siteVisit', title: 'site visit', icon: 'mdi-map-marker', done: false },
        { name: 'goals', title: 'goals', icon: 'mdi-target', done: false },
        { name: 'requirements', title: 'requirements', icon: 'mdi-file-document', done: false }
      ],
      projectApplicationSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: false },
        { name: 'guidelineFormCheck', title: 'Guideline Check (Formalities)', icon: 'mdi-format-list-checks', done: false },
        { name: 'financingCheck', title: 'Financing Check', icon: 'mdi-cash-check', done: false },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: false },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: false },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ]
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
    },
    steps() {
      if (this.tab === 'aiFundingCheck') {
        return this.project && this.project.fundingCheckSteps ? this.project.fundingCheckSteps : this.fundingCheckSteps;
      } else if (this.tab === 'projectDevelopment') {
        return this.project && this.project.projectDevelopmentSteps ? this.project.projectDevelopmentSteps : this.projectDevelopmentSteps;
      } else if (this.tab === 'application') {
        return this.project && this.project.projectApplicationSteps ? this.project.projectApplicationSteps : this.projectApplicationSteps;
      } else {
        return [];
      }
    },
    tabs() {
      return this.project && this.project.applicationProcessSteps ? this.project.applicationProcessSteps : [
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
      ];
    }
  },

  methods: {
    shouldDisableTab(index) {
      // First tab is never disabled
      if (index === 0) return false;

      // Find the previous tab
      const previousTab = this.tabs[index - 1];

      // If the previous tab is done, this tab should be enabled
      if (previousTab && previousTab.done) return false;

      // If this tab itself is done, it should be enabled regardless of previous tab
      if (this.tabs[index].done) return false;

      // Otherwise, disable the tab
      return true;
    },

    goToPreviousStep() {
      const currentIndex = this.steps.findIndex(s => s.name === this.step);
      if (currentIndex > 0) {
        this.step = this.steps[currentIndex - 1].name;
      }
    },
    async goToNextStep(skip) {
      const skipper = skip ? 2 : 1;
      const currentIndex = this.steps.findIndex(s => s.name === this.step);

      if (currentIndex < this.steps.length - 1) {
        // Create a deep copy of the steps to avoid direct state mutation
        const updatedSteps = JSON.parse(JSON.stringify(this.steps));

        if (skipper > 1) {
          updatedSteps[currentIndex + 1].skip = true;
        } else {
          updatedSteps[currentIndex + 1].skip = false;
        }

        // Mark current step as done in our copy
        updatedSteps[currentIndex].done = true;

        // Update only the local store state using our new action
        if (this.tab === 'aiFundingCheck') {
          await this.$store.dispatch('project/updateLocalProjectState', {
            data: {
              fundingCheckSteps: updatedSteps
            }
          });
          // Update form with the updated steps
          this.form = { ...this.form, fundingCheckSteps: updatedSteps };
        } else if (this.tab === 'projectDevelopment') {
          await this.$store.dispatch('project/updateLocalProjectState', {
            data: {
              projectDevelopmentSteps: updatedSteps
            }
          });
          // Update form with the updated steps
          this.form = { ...this.form, projectDevelopmentSteps: updatedSteps };
        } else if (this.tab === 'application') {
          await this.$store.dispatch('project/updateLocalProjectState', {
            data: {
              projectApplicationSteps: updatedSteps
            }
          });
          // Update form with the updated steps
          this.form = { ...this.form, projectApplicationSteps: updatedSteps };
        }

        // After store is updated, move to the next step
        this.step = this.steps[currentIndex + skipper].name;
      }
    },
    async goToNextTab() {
      const currentIndex = this.tabs.findIndex(t => t.name === this.tab);

      // Safety check to ensure we don't go beyond array bounds
      if (currentIndex < this.tabs.length - 1) {
        // Create a deep copy of the tabs
        const updatedTabs = JSON.parse(JSON.stringify(this.tabs));

        // Mark current tab as done
        updatedTabs[currentIndex].done = true;

        // Update the local state tabs in the store
        await this.$store.dispatch('project/updateLocalProjectState', {
          data: {
            applicationProcessSteps: updatedTabs
          }
        });

        // Update form with the updated tabs
        this.form = { ...this.form, applicationProcessSteps: updatedTabs };

        // Move to next tab
        this.tab = this.tabs[currentIndex + 1].name;
        this.setActiveStepBasedOnCompletion();
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

      if (!noChange) {
        this.form.fundingMatches = data.fundingMatches;
      }

      if (noneSelected) {
        // Create a deep copy of the steps
        const updatedSteps = JSON.parse(JSON.stringify(this.steps));

        // Mark qAndA step to be skipped
        const qAndAStepIndex = updatedSteps.findIndex(step => step.name === 'qAndA');
        if (qAndAStepIndex !== -1) {
          updatedSteps[qAndAStepIndex].skip = true;

          // Update local store with the modified steps
          await this.$store.dispatch('project/updateLocalProjectState', {
            data: {
              fundingCheckSteps: updatedSteps
            }
          });

          // Update form with the modified steps
          this.form = { ...this.form, fundingCheckSteps: updatedSteps };
        }
      }

      // Move to next step
      await this.goToNextStep(noneSelected);

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
      this.goToNextTab();
    },
    async handleSubmissionSigningSubmitted(status) {
      if (status !== null) {
        // Final step completed successfully with a decision
        const decisionType = status ? 'Zuwendungsbescheid' : 'Ablehnungsbescheid';
        this.$q.notify({
          color: 'positive',
          message: `${this.$t('Application process completed successfully')} (${decisionType})`
        });

      } else {
        // No decision made
        this.$q.notify({
          color: 'warning',
          message: this.$t('No decision was made on the application')
        });
        this.form = { ...this.form, ...JSON.parse(JSON.stringify(this.project)) };
      }
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
      } else if (this.step === 'taskPlan') {
        await this.$refs.taskPlanRef.submitTaskPlan();
      } else if (this.step === 'siteVisit') {
        await this.$refs.siteVisitRef.submitSiteVisit();
      } else if (this.step === 'goals') {
        await this.$refs.goalsRef.submitGoals();
      } else if (this.step === 'requirements') {
        await this.$refs.requirementsRef.submitRequirements();
      } else if (this.step === 'guidelineContentCheck') {
        await this.$refs.guidelineContentCheckRef.submitGuidelineContentCheck();
      } else if (this.step === 'guidelineFormCheck') {
        await this.$refs.guidelineFormCheckRef.submitGuidelineFormCheck();
      } else if (this.step === 'financingCheck') {
        await this.$refs.financingCheckRef.submitFinancingCheck();
      } else if (this.step === 'projectDocumentsCoordination') {
        await this.$refs.documentsCoordinationRef.submitDocumentsCoordination();
      } else if (this.step === 'applicationDecision') {
        await this.$refs.applicationDecisionRef.submitApplicationDecision();
      } else if (this.step === 'submissionSigning') {
        await this.$refs.submissionSigningRef.submitSubmissionSigning();
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
        if (this.$refs.projectDescriptionRef) {
          this.$refs.projectDescriptionRef.setData();
        }
        this.setActiveTabBasedOnCompletion();
      }
      this.$store.dispatch("userCenter/getUsers");
    },

    setActiveTabBasedOnCompletion() {
      if (!this.tabs || !this.tabs.length) return;

      // Find the last completed tab
      let lastCompletedTabIndex = -1;
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].done) {
          lastCompletedTabIndex = i;
        }
      }

      // If we found a completed tab, set the next one as active
      if (lastCompletedTabIndex !== -1) {
        const nextTabIndex = lastCompletedTabIndex + 1;

        // Make sure we don't go beyond the available tabs
        if (nextTabIndex < this.tabs.length) {
          // Set the next tab as the active one
          this.tab = this.tabs[nextTabIndex].name;
        } else {
          // If all tabs are done, just set the last one as active
          this.tab = this.tabs[lastCompletedTabIndex].name;
        }
      } else {
        // If no tab is done, set the first one as active
        this.tab = this.tabs[0].name;
      }

      // After setting the tab, update the step based on current steps
      this.setActiveStepBasedOnCompletion();
    },

    setActiveStepBasedOnCompletion() {
      if (!this.steps || !this.steps.length) return;

      // Find the last done step without modifying the original array
      const stepsReversed = [...this.steps].reverse();
      const lastDoneStep = stepsReversed.find(step => step.done === true);

      // If found a done step, set it as current
      if (lastDoneStep) {
        this.step = lastDoneStep.name;
      } else {
        // If no done step is found, set the first step
        this.step = this.steps[0].name;
      }
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
