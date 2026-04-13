<template>
  <q-page class="q-mt-lg bg-blue-1" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <q-toolbar class="bg-blue text-white shadow-2 radius-top-20">
      <q-tabs v-model="tab" shrink stretch active-color="yellow" content-class="custom-borders" inline-label>
        <q-tab v-for="(tab, index) in tabs" :key="tab.name" :name="tab.name" :label="$t(tab.title)"
          :icon="tab.done ? 'mdi-check-all' : ''" :disable="shouldDisableTab(index)" />
      </q-tabs>
      <q-space />
      <ProjectActionButtons v-if="project" :project="project" :logged-in-user="loggedInUser" :is-admin="isAdmin"
        :loading-states="loadingStates" @edit-project="handleEditProject" @transfer-document="handleTransferDocument"
        @export-to-pdf="exportToPdf" @add-to-watchlist="() => { }" @duplicate-project="() => { }"
        @archive-project="handleArchiveProject" @delete-project="handleDeleteProject"
        @request-access="handleRequestAccess" />
    </q-toolbar>
    <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated class="radius-bottom-20 shadow-2">
      <q-step v-for="(step, index) in steps" :key="index" :name="step.name" :title="$t(step.title)" :icon="step.icon"
        :done="step.done" :header-nav="step.done" />
    </q-stepper>
    <ProjectContent :currentTab="step" v-if="tab === 'aiFundingCheck'" />

    <div v-if="tab === 'projectDevelopment'">
      <ProjectViewGeneralInfo :project="project" :current-tab="step" />
      <ProjectViewContentDetails :project="project" :current-tab="step" class="q-my-md" />
      <ProjectTaskPlan :project="project" :current-tab="step" class="q-my-md" />
      <ProjectSiteVisit v-if="step !== 'taskPlan'" :project="project" :current-tab="step" class="q-my-md" />
      <ProjectGoals v-if="step !== 'taskPlan' && step !== 'siteVisit'" :project="project" :current-tab="step"
        class="q-my-md" />
      <ProjectRequirements v-if="step !== 'taskPlan' && step !== 'siteVisit' && step !== 'goals'" :project="project"
        :current-tab="step" class="q-my-md" />
    </div>

    <div v-if="tab === 'application'">
      <ProjectViewGeneralInfo :project="project" :current-tab="step" />
      <ProjectViewContentDetails :project="project" :current-tab="step" class="q-my-md" />
      <ProjectGuidelineContentCheck :project="project" :current-tab="step" class="q-my-md" />
      <ProjectGuidelineFormCheck v-if="step !== 'guidelineContentCheck'" :project="project" :current-tab="step"
        class="q-my-md" />
      <ProjectFinancingCheck v-if="step !== 'guidelineContentCheck' && step !== 'guidelineFormCheck'" :project="project"
        :current-tab="step" class="q-my-md" />
      <ProjectDocumentsCoordination
        v-if="step !== 'guidelineContentCheck' && step !== 'guidelineFormCheck' && step !== 'financingCheck'"
        :project="project" :current-tab="step" class="q-my-md" />
      <ProjectApplicationDecision
        v-if="step !== 'guidelineContentCheck' && step !== 'guidelineFormCheck' && step !== 'financingCheck' && step !== 'projectDocumentsCoordination'"
        :project="project" :current-tab="step" class="q-my-md" />
      <ProjectSubmissionSigning v-if="step === 'submissionSigning'" :project="project" :current-tab="step"
        class="q-my-md" />
    </div>

    <!-- PDF Export Component -->
    <ProjectPrint v-if="project" :project="project" ref="projectPrint" />

    <!-- Dialogs -->
    <DeleteDialog v-if="project" :id="itemId" tab="projectIdeas" :dialogState="deleteDialog"
      @update="closeDeleteDialog($event), (itemId = null)" />

    <ArchiveDialog v-if="project" :id="itemId" tab="projectIdeas" :dialogState="archiveDialog"
      @update="closeArchiveDialog($event), (itemId = null)" />

    <RequestAccessDialog v-if="project" :id="itemId" tab="projectIdeas" :type="requestAccessType"
      :dialogState="requestDialog" @update="(requestDialog = $event), (itemId = null), (requestAccessType = null)" />

    <DocumentTransferDialog v-if="project && project.id && (project.owner.id === loggedInUser.id || isAdmin)"
      :id="itemId" type="project" :dialogState="documentTransferDialog"
      @update="closeDocumentTransferDialog($event), (itemId = null)" />
  </q-page>
</template>

<script>
import ProjectContent from "components/projects/view/ProjectContent.vue";
import ProjectViewGeneralInfo from 'src/components/projects/view/ProjectGeneralInfo.vue';
import ProjectViewContentDetails from 'src/components/projects/view/ProjectContentDetails.vue';
import ProjectTaskPlan from 'src/components/projects/view/ProjectTaskPlan.vue';
import ProjectSiteVisit from 'src/components/projects/view/ProjectSiteVisit.vue';
import ProjectGoals from 'src/components/projects/view/ProjectGoals.vue';
import ProjectRequirements from 'src/components/projects/view/ProjectRequirements.vue';
import ProjectGuidelineContentCheck from 'src/components/projects/view/ProjectGuidelineContentCheck.vue';
import ProjectGuidelineFormCheck from 'src/components/projects/view/ProjectGuidelineFormCheck.vue';
import ProjectFinancingCheck from 'src/components/projects/view/ProjectFinancingCheck.vue';
import ProjectDocumentsCoordination from 'src/components/projects/view/ProjectDocumentsCoordination.vue';
import ProjectApplicationDecision from 'src/components/projects/view/ProjectApplicationDecision.vue';
import ProjectSubmissionSigning from 'src/components/projects/view/ProjectSubmissionSigning.vue';
import ProjectActionButtons from 'src/components/projects/view/ProjectActionButtons.vue';
import ProjectPrint from 'src/components/projects/view/ProjectPrint.vue';
import DeleteDialog from 'components/data/DeleteDialog.vue';
import ArchiveDialog from 'components/data/ArchiveDialog.vue';
import RequestAccessDialog from 'components/data/RequestAccessDialog.vue';
import DocumentTransferDialog from 'components/DocumentTransferDialog.vue';

export default {
  name: "projectView",
  components: {
    ProjectContent,
    ProjectViewGeneralInfo,
    ProjectViewContentDetails,
    ProjectTaskPlan,
    ProjectSiteVisit,
    ProjectGoals,
    ProjectRequirements,
    ProjectGuidelineContentCheck,
    ProjectGuidelineFormCheck,
    ProjectFinancingCheck,
    ProjectDocumentsCoordination,
    ProjectApplicationDecision,
    ProjectSubmissionSigning,
    ProjectActionButtons,
    ProjectPrint,
    DeleteDialog,
    ArchiveDialog,
    RequestAccessDialog,
    DocumentTransferDialog
  },
  data() {
    return {
      step: 'project',
      tab: 'aiFundingCheck',
      itemId: null,
      requestAccessType: null,
      requestDialog: false,
      deleteDialog: false,
      archiveDialog: false,
      documentTransferDialog: false,
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
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
    loadingStates() {
      return {
        watchlist: false,
        edit: false,
        duplicate: false,
        archive: false,
        delete: false
      };
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
    handleEditProject(id) {
      this.$router.push({
        path: `/application/process/edit/${id}`,
        query: { tab: this.tab, step: this.step }
      });
    },
    handleTransferDocument() {
      this.itemId = this.project && this.project.id;
      this.documentTransferDialog = true;
    },
    handleArchiveProject(itemId) {
      this.itemId = itemId;
      this.archiveDialog = true;
    },
    handleDeleteProject(itemId) {
      this.itemId = itemId;
      this.deleteDialog = true;
    },
    handleRequestAccess({ id, type }) {
      this.itemId = id;
      this.requestAccessType = type;
      this.requestDialog = true;
    },
    closeArchiveDialog(val) {
      this.archiveDialog = val;
      if (this.project && this.project.archived === true) {
        this.$router.go(-1);
      }
    },
    closeDeleteDialog(val) {
      this.deleteDialog = val;
      if (this.project && !this.project.id) {
        this.$router.go(-1);
      }
    },
    closeDocumentTransferDialog(val) {
      this.documentTransferDialog = val;
    },
    exportToPdf() {
      if (this.$refs.projectPrint) {
        this.$refs.projectPrint.exportToPdf();
      }
    },
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
    updateStepToFirstOfTab() {
      // Set the step to the first step of the current tab
      if (this.steps && this.steps.length > 0) {
        this.step = this.steps[0].name;
      }
    },
    async getData() {
      this.$q.loading.show();
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.$route.params.id || this.$route.params.projectId)
      });
      this.$q.loading.hide();
    },
  },
  watch: {
    tab() {
      // When tab changes, update the step to the first step of that tab
      this.updateStepToFirstOfTab();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss">
.carouselThumbnails .q-tabs__arrow--end {
  right: -70px;
  color: $blue;
}

.carouselThumbnails .q-tabs__arrow--start {
  left: -70px;
  color: $blue;
}

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
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(15deg);
      left: 0%;
      width: 2px;
      height: 40%;
      background-color: $grey;
    }
  }
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
</style>
