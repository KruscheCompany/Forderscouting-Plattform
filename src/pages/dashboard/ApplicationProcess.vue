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
      <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated class="shadow-2"
        :class="$q.screen.gt.xs ? 'radius-bottom-20' : ''">
        <q-step v-for="(step, index) in steps" :key="index" :name="step.name"
          :title="$q.screen.gt.xs ? $t(step.title) : ''" :icon="step.icon" :done="step.done && !step.skip"
          :header-nav="step.done && !step.skip" active-color="yellow" />
      </q-stepper>
      <div v-if="$q.screen.xs && activeStepTitle"
        class="bg-white text-center text-caption text-primary q-py-xs q-px-md radius-bottom-20 shadow-2">
        {{ $t(activeStepTitle) }}
      </div>
    </div>

    <div v-if="tab === 'aiFundingCheck'">
      <ProjectDescriptionCreate v-if="step === 'project'" ref="projectDescriptionRef" :current-tab="step"
        @project-created="handleProjectCreated" />

      <ProjectViewGeneralInfo v-if="step !== 'project'" :project="form" :current-tab="step" />
      <ProjectViewContentDetails v-if="step !== 'project'" :project="form" :current-tab="step" class="q-my-md" />

      <ProjectFundingCheckCreate ref="fundingCheckRef" class="q-my-md" :current-tab="step" :project-data="form"
        :created-project-id="createdProjectId" @funding-submitted="handleFundingSubmitted"
        v-if="step === 'fundingCheck'" />

      <ProjectViewFundingCheck v-if="step !== 'project' && step !== 'fundingCheck'" :project="form" :current-tab="step"
        class="q-my-md" />

      <ProjectQAndACreate ref="qAndARef" v-if="step === 'qAndA' && !skipQuestions"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @q-and-a-submitted="handleQAndASubmitted" />

      <ProjectViewQAndA v-if="step !== 'project' && step !== 'fundingCheck' && step !== 'qAndA' && !skipQuestions"
        :project="form" :current-tab="step" class="q-my-md" />

      <ProjectAptitudeCreate ref="aptitudeRef" v-if="step === 'aptitude'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @aptitude-submitted="handleAptitudeSubmitted"
        @tickets-updated="val => (aptitudeGateOpen = val)" />

      <ProjectViewAptitude
        v-if="step !== 'project' && step !== 'fundingCheck' && step !== 'qAndA' && step !== 'aptitude'" :project="form"
        :current-tab="step" class="q-my-md" />

      <ProjectDecisionCreate ref="decisionRef" v-if="step === 'decision'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @decision-submitted="handleDecisionSubmitted" />
    </div>

    <div v-if="tab === 'projectDevelopment'">
      <ProjectViewGeneralInfo :project="form" :current-tab="step" />
      <ProjectViewContentDetails :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewFundingCheck :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewQAndA v-if="!skipQuestions" :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewAptitude :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewDecision :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewTaskPlan v-if="step !== 'taskPlan'" :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewSiteVisit v-if="step !== 'taskPlan' && step !== 'siteVisit'" :project="form" :current-tab="step"
        class="q-my-md" />
      <ProjectViewGoalsAndRequirements v-if="step !== 'taskPlan' && step !== 'siteVisit' && step !== 'goalsAndRequirements'"
        :project="form" :current-tab="step" class="q-my-md" />

      <ProjectTaskPlanCreate ref="taskPlanRef" v-if="step === 'taskPlan'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @taskPlan-submitted="goToNextStep(false)" />

      <ProjectSiteVisit ref="siteVisitRef" v-if="step === 'siteVisit'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @siteVisit-submitted="goToNextStep(false)" />

      <ProjectGoalsAndRequirements ref="goalsAndRequirementsRef" v-if="step === 'goalsAndRequirements'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @goalsAndRequirements-submitted="goToNextStep(false)" />

      <ProjectFinancingCheck ref="financingCheckRef" v-if="step === 'financingCheck'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @financingCheck-submitted="goToNextTab" />
    </div>

    <div v-if="tab === 'application'">
      <ProjectViewGeneralInfo :project="form" :current-tab="step" />
      <ProjectViewContentDetails :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewFundingCheck :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewQAndA v-if="!skipQuestions" :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewAptitude :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewDecision :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewTaskPlan :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewSiteVisit :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewGoalsAndRequirements :project="form" :current-tab="step" class="q-my-md" />
      <ProjectViewFinancingCheck :project="form" :current-tab="step" class="q-my-md" />

      <ProjectViewGuidelineContentCheck v-if="step !== 'guidelineContentCheck'" :project="form" :current-tab="step"
        class="q-my-md" />
      <ProjectViewDocumentsCoordination v-if="step !== 'guidelineContentCheck' && step !== 'projectDocumentsCoordination'"
        :project="form" :current-tab="step" class="q-my-md" />

      <ProjectGuidelineContentCheck ref="guidelineContentCheckRef" v-if="step === 'guidelineContentCheck'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @guidelineContentCheck-submitted="goToNextStep(false)" />

      <ProjectDocumentsCoordination ref="documentsCoordinationRef" v-if="step === 'projectDocumentsCoordination'"
        :created-project-id="createdProjectId" :project-data="form" :current-tab="step" class="q-my-md"
        @documentsCoordination-submitted="goToNextStep(false)" />

      <ProjectApplicationDecision ref="applicationDecisionRef"
        v-if="step === 'applicationDecision' || step === 'guidelineContentCheck'" :created-project-id="createdProjectId"
        :project-data="form" :current-tab="step" class="q-my-md" @applicationDecision-submitted="goToNextStep(false)" />

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
          <q-btn :loading="isLoading" :disable="step === 'aptitude' && !aptitudeGateOpen" @click="manageSubmit"
            size="16px" color="primary" class="text-white q-px-xl q-py-sm full-width" no-caps
            :label="$t('Publish')" />
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
import ProjectGoalsAndRequirements from 'src/components/projects/create/ProjectGoalsAndRequirements.vue';
import ProjectGuidelineContentCheck from 'src/components/projects/create/ProjectGuidelineContentCheck.vue';
import ProjectFinancingCheck from 'src/components/projects/create/ProjectFinancingCheck.vue';
import ProjectDocumentsCoordination from 'src/components/projects/create/ProjectDocumentsCoordination.vue';
import ProjectApplicationDecision from 'src/components/projects/create/ProjectApplicationDecision.vue';
import ProjectSubmissionSigning from 'src/components/projects/create/ProjectSubmissionSigning.vue';

import ProjectViewGeneralInfo from 'src/components/projects/view/ProjectGeneralInfo.vue';
import ProjectViewContentDetails from 'src/components/projects/view/ProjectContentDetails.vue';
import ProjectViewApplicationDecision from 'src/components/projects/view/ProjectApplicationDecision.vue';
import ProjectViewFundingCheck from 'src/components/projects/view/ProjectFundingCheck.vue';
import ProjectViewQAndA from 'src/components/projects/view/ProjectQAndA.vue';
import ProjectViewGoalsAndRequirements from 'src/components/projects/view/ProjectGoalsAndRequirements.vue';
import ProjectViewGuidelineContentCheck from 'src/components/projects/view/ProjectGuidelineContentCheck.vue';
import ProjectViewFinancingCheck from 'src/components/projects/view/ProjectFinancingCheck.vue';
import ProjectViewDocumentsCoordination from 'src/components/projects/view/ProjectDocumentsCoordination.vue';
import ProjectViewAptitude from 'src/components/projects/view/ProjectAptitude.vue';
import ProjectViewDecision from 'src/components/projects/view/ProjectDecision.vue';
import ProjectViewTaskPlan from 'src/components/projects/view/ProjectTaskPlan.vue';
import ProjectViewSiteVisit from 'src/components/projects/view/ProjectSiteVisit.vue';


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
    ProjectGoalsAndRequirements,
    ProjectGuidelineContentCheck,
    ProjectFinancingCheck,
    ProjectDocumentsCoordination,
    ProjectApplicationDecision,
    ProjectSubmissionSigning,
    ProjectViewGeneralInfo,
    ProjectViewContentDetails,
    ProjectViewApplicationDecision,
    ProjectViewFundingCheck,
    ProjectViewQAndA,
    ProjectViewGoalsAndRequirements,
    ProjectViewGuidelineContentCheck,
    ProjectViewFinancingCheck,
    ProjectViewDocumentsCoordination,
    ProjectViewAptitude,
    ProjectViewDecision,
    ProjectViewTaskPlan,
    ProjectViewSiteVisit
  },
  data() {
    return {
      step: 'project',
      tab: 'aiFundingCheck',
      secondaryTab: 'project',
      isLoading: false,
      aptitudeGateOpen: false,
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
        { name: 'goalsAndRequirements', title: 'Goals and requirements', icon: 'mdi-target', done: false },
        { name: 'financingCheck', title: 'Financing Check', icon: 'mdi-cash-check', done: false }
      ],
      projectApplicationSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: false },
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
    activeStepTitle() {
      const current = this.steps.find(s => s.name === this.step);
      return current ? current.title : '';
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
  watch: {
    step(newStep) {
      this.refreshData();
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

      // Check if we're creating a new project from scratch (no projectId in URL)
      if (!this.$route.params.projectId) {
        // Redirect to edit route with the new project ID and a query param to trigger funding match
        this.$router.push({
          name: 'EditApplicationProcess',
          params: { projectId: data.id },
          query: { triggerFundingMatch: hasStartingConditionChanged || !this.form.fundingMatches ? '1' : '0' }
        });
        return; // Stop execution here as we're redirecting
      }

      // Original logic for existing projects
      if (hasStartingConditionChanged || !this.form.fundingMatches) {
        this.handleFundingMatch(data.projectData);
      } else {
        this.step = 'fundingCheck';
      }
    },
    async handleFundingMatch(projectData) {
      const { startingCondition, goals, content, valuesAndBenefits } = projectData.details || {};
      const { financialPlan } = projectData;
      const finances = `${financialPlan?.description || ''} ${(financialPlan?.costAndFinance || []).map(item => `${item.title}: ${item.value} Euro`).join(', ')}`;
      this.$q.loading.show({ message: this.$t('projectComponents.fundingCheck.matchingLoading') });
      try {
        await this.$store.dispatch('ai/matchFunding', {
          startingCondition,
          goals,
          content,
          valuesAndBenefits,
          finances
        });

        this.step = 'fundingCheck';

      } catch (fundingError) {
        console.error('Funding matching failed:', fundingError);
        this.step = 'fundingCheck';
      } finally {
        // Let the (large, one-off) layout reflow from the funding cards mounting happen
        // while still covered by the loading overlay, so hiding it doesn't reveal a jump
        await this.$nextTick();
        this.$q.loading.hide();
      }
    },
    async handleFundingSubmitted(data) {
      const { noChange, noneSelected } = data;
      const { startingCondition, goals, content, valuesAndBenefits } = this.project.details || {};
      const { financialPlan } = this.project;
      const finances = `${financialPlan?.description || ''} ${(financialPlan?.costAndFinance || []).map(item => `${item.title}: ${item.value} Euro`).join(', ')}`;

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
        // Get all selected fundings instead of just one
        const selectedFundings = data.fundingMatches.filter(funding => funding.selected);

        // Call the API for each selected funding
        for (const funding of selectedFundings) {
          await this.$store.dispatch('ai/getFundingQuestions', {
            fundingId: funding._id,
            startingCondition,
            goals,
            content,
            valuesAndBenefits,
            finances
          });
        }
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
        this.$store.dispatch("notifications/pushToast", { kind: "positive", title: `${this.$t('Application process completed successfully')}` });

        // Redirect to view page after successful completion
        if (this.createdProjectId) {
          this.$router.push({
            name: 'ViewApplicationProcess',
            params: { projectId: this.createdProjectId }
          });
        }
      } else {
        // No decision made
        this.$store.dispatch("notifications/pushToast", { kind: "warning", title: this.$t('No decision was made on the application') });
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
      } else if (this.step === 'goalsAndRequirements') {
        await this.$refs.goalsAndRequirementsRef.submitGoalsAndRequirements();
      } else if (this.step === 'guidelineContentCheck') {
        await this.$refs.guidelineContentCheckRef.submitGuidelineContentCheck();
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

        // If coming from a redirect (has triggerFundingMatch query), trigger the AI match now
        // that form is populated from the freshly-fetched project. Otherwise use the normal behavior
        if (this.$route.query.triggerFundingMatch === '1') {
          await this.handleFundingMatch(this.form);
        } else if (this.$route.query.tab) {
          // Restore tab and step from view mode navigation
          this.tab = this.$route.query.tab;
          if (this.$route.query.step) {
            this.step = this.$route.query.step;
          }
        } else {
          this.setActiveTabBasedOnCompletion();
        }
      }
      this.$store.dispatch("userCenter/getUsers");
    },

    refreshData() {
      if ((!!this.$route.params && this.$route.params.projectId) || this.form.id) {
        const id = this.form.id || Number(this.$route.params.projectId);
        this.createdProjectId = id;
        // this.$q.loading.show();
        this.$store.dispatch("project/getSpecificProject", {
          id: id,
        }).then(() => {
          this.form = {
            ...this.form,
            ...JSON.parse(
              JSON.stringify({
                ...this.project,
              })
            ),
          };
          if (this.$refs.projectDescriptionRef) {
            this.$refs.projectDescriptionRef.setData();
          }
          // this.$q.loading.hide();
        }).catch(() => {
          // this.$q.loading.hide();
        });
      }
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
    this.$store.dispatch("ai/resetTaxonomySuggestions");
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

.text-yellow .q-stepper__title {
  color: $blue !important;
}

.text-yellow .q-stepper__dot span i {
  color: $blue !important;
}
</style>
