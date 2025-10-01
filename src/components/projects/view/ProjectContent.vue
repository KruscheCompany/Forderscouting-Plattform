<template>
  <div class="q-mt-md">
    <div v-if="!!project">
      <div class="row">
        <!-- Project Requests Section -->
        <ProjectRequestsList :requests="project.requests" :is-admin="isAdmin" @refresh-data="getData" />

        <!-- Project Header Section -->
        <div class="col-12">
          <div class="row">
            <ProjectHeader :project="project" :logged-in-user="loggedInUser" :is-admin="isAdmin"
              :loading-states="loadingStates" @transfer-document="handleTransferDocument" @export-to-pdf="exportToPdf"
              @archive-project="handleArchiveProject" @delete-project="handleDeleteProject"
              @request-access="handleRequestAccess" />
          </div>
        </div>
      </div>

      <!-- PDF Export Component -->
      <ProjectPrint :project="project" ref="projectPrint" />

      <!-- Main Content Layout -->
      <div class="row">

        <!-- Contact Information -->
        <ProjectGeneralInfo :project="project" :currentTab="currentTab" class="col-12 q-mb-md" />

        <!-- Main Content -->
        <ProjectContentDetails :project="project" :currentTab="currentTab" class="col-12 q-mb-md"
          @open-document-preview="handleOpenDocumentPreviewModal" />

        <!-- Funding Check Section -->
        <ProjectFundingCheck v-if="currentTab !== 'project' && currentTab !== 'qAndA'" :project="project"
          :currentTab="currentTab" class="col-12 q-mb-md" />

        <!-- Q&A Section -->
        <ProjectQAndA v-if="currentTab !== 'project' && currentTab !== 'fundingCheck' && !skipQuestions"
          :project="project" :currentTab="currentTab" class="col-12 q-mb-md" />

        <!-- Aptitude Section -->
        <ProjectAptitude v-if="currentTab !== 'project' && currentTab !== 'fundingCheck' && currentTab !== 'qAndA'"
          :project="project" :currentTab="currentTab" class="col-12 q-mb-md" />

        <!-- Decision Section -->
        <ProjectDecision v-if="currentTab === 'decision'" :project="project" :currentTab="currentTab"
          class="col-12 q-mb-md" />
      </div>
    </div>

    <!-- Dialogs -->
    <DeleteDialog :id="itemId" :tab="tab" :dialogState="deleteDialog"
      @update="closeDeleteDialog($event), (itemId = null)" />

    <ArchiveDialog :id="itemId" :tab="tab" :dialogState="archiveDialog"
      @update="closeArchiveDialog($event), (itemId = null)" />

    <RequestAccessDialog :id="itemId" :tab="tab" :type="type" :dialogState="requestDialog" @update="
      (requestDialog = $event),
      (itemId = null),
      (type = null),
      (editIsLoading = false),
      (duplicateIsLoading = false)
      " />

    <DocumentTransferDialog v-if="!!project && !!project.id && (project.owner.id === loggedInUser.id || isAdmin)"
      :id="itemId" type="project" :dialogState="documentTransferDialog"
      @update="closeDocumentTransferDialog($event), (itemId = null)" />

    <!-- Preview Document Dialog -->
    <q-dialog v-model="showPreviewDocumentDialog" full-width>
      <q-card>
        <q-card-section style="max-height: 70vh;" class="scroll">
          <iframe className="doc" title="file" :src="previewDocumentData"
            style="width: 100%; height: 70vh; border-style: none;" type="application/pdf" />
          <div style="width: 100%; height: 70vh; opacity: 0;">&nbsp;</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { dateFormatter } from "src/boot/dateFormatter";
import DeleteDialog from "components/data/DeleteDialog.vue";
import ArchiveDialog from "components/data/ArchiveDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
import DocumentTransferDialog from "components/DocumentTransferDialog.vue";

// Import new components
import ProjectRequestsList from "./ProjectRequestsList.vue";
import ProjectHeader from "./ProjectHeader.vue";
import ProjectGeneralInfo from "./ProjectGeneralInfo.vue";
import ProjectContentDetails from "./ProjectContentDetails.vue";
import ProjectPrint from "./ProjectPrint.vue";
import ProjectFundingCheck from "./ProjectFundingCheck.vue";
import ProjectQAndA from "./ProjectQAndA.vue";
import ProjectAptitude from "./ProjectAptitude.vue";
import ProjectDecision from "./ProjectDecision.vue";

export default {
  name: "projectContent",
  data() {
    return {
      itemId: null,
      tab: "projectIdeas",
      type: null,
      requestDialog: false,
      deleteDialog: false,
      archiveDialog: false,
      documentTransferDialog: false,
      isLoading: false,
      previewDocumentData: null,
      actionButton: false,
      previewDocumentTitle: "previewDocumentTitle",
      showPreviewDocumentDialog: false,
    };
  },
  props: {
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  components: {
    DeleteDialog,
    ArchiveDialog,
    RequestAccessDialog,
    DocumentTransferDialog,
    ProjectRequestsList,
    ProjectHeader,
    ProjectGeneralInfo,
    ProjectContentDetails,
    ProjectPrint,
    ProjectFundingCheck,
    ProjectQAndA,
    ProjectAptitude,
    ProjectDecision
  },
  watch: {
    $route(to, from) {
      if (
        (to.params && to.params.id) !==
        (this.$store.state.project.project &&
          this.$store.state.project.project.id)
      ) {
        this.getNewData(to.params.id);
      }
    }
  },
  methods: {
    async getProject() {
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.project.id)
      });
    },

    dateFormatter,

    closeArchiveDialog(val) {
      this.archiveDialog = val;
      if (!!this.project && this.project.archived === true) {
        this.$router.go(-1);
      }
    },

    closeDocumentTransferDialog(val) {
      this.documentTransferDialog = val;
      if (!!this.project && this.project.id) {
        this.documentTransferDialog = false;
      }
    },

    closeDeleteDialog(val) {
      this.deleteDialog = val;
      if (!!this.project && !this.project.id) {
        this.$router.go(-1);
      }
    },

    async getData() {
      this.$q.loading.show();
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.$route.params.id || this.$route.params.projectId)
      });
      this.$q.loading.hide();
    },

    async getNewData(id) {
      if (!!id) {
        this.$q.loading.show();
        await this.$store.dispatch("project/getSpecificProject", {
          id: id
        });
        this.$q.loading.hide();
      }
    },

    async handleOpenDocumentPreviewModal(file) {
      this.showPreviewDocumentDialog = true;
      this.previewDocumentData = `https://pdf.foerderscouting-plattform.de/generic/web/viewer_readonly.html?file=${process.env.VUE_APP_MAIN_URL}/api/file/${file.id}?token=${this.$store.state.userCenter.user.jwt}`;
    },

    // Dialog event handlers
    handleTransferDocument() {
      this.itemId = !!this.project && this.project.id;;
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
      this.type = type;
      this.requestDialog = true;
    },

    handleDelete() {
      this.getData();
    },

    handleArchive() {
      this.getData();
    },

    handleTransfer() {
      this.getData();
    },

    handleRequestAccessComplete() {
      this.getData();
    },

    exportToPdf() {
      if (this.$refs.projectPrint) {
        this.$refs.projectPrint.exportToPdf();
      }
    },

  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
    isDashboardView() {
      return (
        this.$router.currentRoute.meta &&
        this.$router.currentRoute.meta.backLink === "/user/data"
      );
    },
    project() {
      return this.$store.state.project.project;
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
    skipQuestions() {
      return this.project.fundingCheckSteps.some(step => step.skip);
    }
  },
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

.imageStyling {
  background-size: contain;
  background-repeat: no-repeat;
}

.tabStyling div.q-img__image {
  background-size: contain !important;
  background-repeat: no-repeat !important;
}

.text-block {
  white-space: pre-line;
}

.mobile-row {
  max-width: 300px;
}

.action-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
