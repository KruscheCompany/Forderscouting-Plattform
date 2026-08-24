<template>
  <q-expansion-item v-if="showSection" v-model="expanded" header-class="bg-green-1 q-px-md"
    expand-icon-class="text-blue" class="q-mt-md q-mb-lg radius-20 shadow-1 overflow-hidden bg-white">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon name="mdi-star" color="green-9" />
      </q-item-section>
      <q-item-section>
        <span class="font-16 text-weight-600 text-green-9">{{ $t("ProjectDashboard.prioritizedProjects") }}</span>
      </q-item-section>
    </template>

    <div class="priority-table">
      <div v-if="isAdmin" class="q-pa-md" :class="{ 'priority-selector-border': selectedMunicipality }">
        <p class="text-black q-mb-xs font-14">{{ $t("ProjectDashboard.municipalities") }}</p>
        <q-select clearable class="no-shadow input-radius-4" style="max-width: 320px" color="primary"
          bg-color="grey-2" :label="$t('Search')" filled :options="municipalityOptions"
          v-model="selectedMunicipality" option-value="id" option-label="title" @input="onMunicipalityChange" />
      </div>

      <div v-if="isAdmin && !selectedMunicipality" class="priority-empty-state q-pa-xl text-center">
        <q-icon name="mdi-office-building-outline" size="40px" color="grey-5" />
        <p class="text-blue-grey-7 font-14 q-mt-sm q-mb-none">{{ $t("ProjectDashboard.selectMunicipalityPrompt") }}</p>
      </div>

      <div v-else-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="2em" />
      </div>

      <div v-else-if="prioritizedProjects.length === 0" class="priority-empty-state q-pa-xl text-center">
        <q-icon name="mdi-star-off-outline" size="40px" color="grey-5" />
        <p class="text-blue-grey-7 font-14 q-mt-sm q-mb-none">{{ $t("ProjectDashboard.noPrioritizedProjects") }}</p>
      </div>

      <q-table v-else flat class="pagination-no-shadow" :class="filtersExpanded ? 'yellowBg' : ''"
        :data="filteredList" :columns="columns"
        row-key="id" :table-style="{ tableLayout: 'fixed' }" :pagination.sync="pagination"
        :rows-per-page-label="$t('Records per page')"
        :no-data-label="$t('No data')" :no-results-label="$t('No results')" hide-bottom>
        <template v-slot:header="props">
          <q-tr class="tableHeader" :props="props">
            <q-th v-if="isLeader" auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props" :style="col.headerStyle" class="font-14 text-black">
              {{ col.label }}
            </q-th>
            <q-th :style="{ width: expandColumnWidth }" />
            <q-th v-if="isLeader" auto-width />
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="priority-row" :draggable="isLeader && !isSorted"
            @dragstart="onRowDragStart(props.row)" @dragover.prevent @drop="onRowDrop(props.row)">
            <q-td v-if="isLeader" auto-width class="priority-col-handle">
              <q-icon name="mdi-drag" size="sm" :class="isSorted ? 'text-grey-5' : 'drag-handle cursor-pointer'" />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props" :style="col.style" class="font-14 cursor-pointer"
              @click="view(props.row.project)">
              <template v-if="col.name === 'applicationProcess'">
                <q-badge color="primary" class="text-white q-py-sm q-px-md" :style="stepBadgeStyle" v-if="!props.row.project.applicationProcessSteps">
                  {{ $t("aiFundingCheck") }}
                </q-badge>
                <q-badge :color="getLastCompletedStepColor(props.row.project.applicationProcessSteps)"
                  :text-color="getLastCompletedStepTextColor(props.row.project.applicationProcessSteps)"
                  class="text-white q-py-sm q-px-md" :style="stepBadgeStyle" v-else>
                  {{ getLastCompletedStep(props.row.project.applicationProcessSteps) }}
                </q-badge>
              </template>
              <template v-else-if="col.name === 'status'">
                <q-badge :color="getStatusColor(props.row.project.status)"
                  :class="props.row.project.status === null ? 'text-black' : 'text-white'" class="q-py-sm q-px-md" :style="statusBadgeStyle">
                  {{ getStatusText(props.row.project.status) }}
                </q-badge>
              </template>
              <template v-else>
                <q-tooltip v-if="col.value && col.value.length > 48" anchor="bottom left" self="top left"
                  content-style="font-size: 14px">
                  {{ col.value }}
                </q-tooltip>
                {{
                  col.value && col.value.length > 125
                    ? col.value.substring(0, 125) + "..."
                    : col.value
                }}
              </template>
            </q-td>
            <q-td :style="{ width: expandColumnWidth }" class="text-center">
              <q-btn size="md" color="blue" round dense @click.stop="toggleExpand(props.row)"
                :icon="isExpanded(props.row) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </q-td>
            <q-td v-if="isLeader" auto-width class="text-right">
              <q-btn flat dense round size="sm" icon="close" color="grey-8"
                :title="$t('ProjectDashboard.removeFromPriorityList')" @click.stop="remove(props.row)" />
            </q-td>
          </q-tr>
          <FinancialPlanRow :visible="isExpanded(props.row)" :financial-plan="getFinancialPlan(props.row)"
            :funding-matches="props.row.project.fundingMatches" :external-id="props.row.project.external_id" />
        </template>
      </q-table>
    </div>
    <RequestAccessDialog :id="requestProjectId" tab="projectIdeas" type="view" :dialogState="requestDialog"
      @update="(requestDialog = $event), (requestProjectId = null)" />
  </q-expansion-item>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
import FinancialPlanRow from "components/projectDashboard/FinancialPlanRow.vue";
import projectStatusLabels from "src/mixins/projectStatusLabels";
import applicationFilterOptions from "src/mixins/applicationFilterOptions";
import financialPlanExpand from "src/mixins/financialPlanExpand";
import { APPLICATION_TABLE_COLUMN_WIDTHS as COLUMN_WIDTHS } from "src/constants/applicationTableColumns";

export default {
  name: "PriorityTable",
  mixins: [projectStatusLabels, applicationFilterOptions, financialPlanExpand],
  components: {
    RequestAccessDialog,
    FinancialPlanRow,
  },
  props: {
    search: { type: String, default: "" },
    selectedApplicationSteps: { type: Array, default: null },
    selectedStatus: { type: Array, default: null },
    selectedLocations: { type: Array, default: null },
    selectedInvestive: { type: Array, default: null },
    selectedCategories: { type: Array, default: null },
    tagsKeywords: { type: Array, default: null },
    filtersExpanded: { type: Boolean, default: false },
  },
  data() {
    return {
      expanded: true,
      loading: false,
      selectedMunicipality: null,
      localList: [],
      requestDialog: false,
      requestProjectId: null,
      dragRow: null,
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
    },
    isSorted() {
      return !!this.pagination.sortBy;
    },
    expandColumnWidth() {
      return COLUMN_WIDTHS.expand;
    },
    filteredList() {
      const searchTerm = (this.search || "").trim().toLowerCase();
      const statusValues = (this.selectedStatus || []).map((item) => (item.value !== undefined ? item.value : item));
      const stepValues = (this.selectedApplicationSteps || []).map((item) => item.value || item);
      const categoryIds = (this.selectedCategories || []).map((item) => item.id || item);
      const tagIds = (this.tagsKeywords || []).map((item) => item.id || item);
      const locationTitles = (this.selectedLocations || []).map((item) => item.title || item);
      const investiveValues = (this.selectedInvestive || []).map((item) => (item.value !== undefined ? item.value : item));

      return this.localList.filter((row) => {
        const project = row.project || {};

        if (searchTerm.length >= 3 && !(project.title || "").toLowerCase().includes(searchTerm)) {
          return false;
        }
        if (statusValues.length && !statusValues.includes(project.status)) {
          return false;
        }
        if (stepValues.length && !stepValues.includes(this.getLastCompletedStepValue(project.applicationProcessSteps))) {
          return false;
        }
        if (categoryIds.length) {
          const projectCategoryIds = (project.categories || []).map((c) => c.id);
          if (!categoryIds.some((id) => projectCategoryIds.includes(id))) return false;
        }
        if (tagIds.length) {
          const projectTagIds = (project.tags || []).map((t) => t.id);
          if (!tagIds.some((id) => projectTagIds.includes(id))) return false;
        }
        if (locationTitles.length && !locationTitles.includes(project.info?.location)) {
          return false;
        }
        if (investiveValues.length) {
          const details = project.details || {};
          const matches = investiveValues.some((v) => (v === true ? !!details.investive : v === false ? !!details.nonInvestive : false));
          if (!matches) return false;
        }
        return true;
      });
    },
    columns() {
      return [
        {
          name: "title",
          required: true,
          label: this.$t("ProjectDashboard.title"),
          align: "left",
          field: (row) => row.project.title,
          sortable: true,
          style: "overflow: hidden; white-space: nowrap; text-overflow: ellipsis;",
        },
        {
          name: "updatedAt",
          align: "center",
          label: this.$t("Speicherdatum"),
          field: (row) => row.project.updatedAt,
          sortable: true,
          format: (val) => (val ? this.formatDate(val) : ""),
          style: `width: ${COLUMN_WIDTHS.updatedAt}`,
          headerStyle: `width: ${COLUMN_WIDTHS.updatedAt}`,
        },
        {
          name: "location",
          align: "left",
          label: this.$t("ProjectDashboard.locations"),
          field: (row) => row.project.info?.location,
          sortable: true,
          style: `width: ${COLUMN_WIDTHS.location}; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;`,
          headerStyle: `width: ${COLUMN_WIDTHS.location}`,
        },
        {
          name: "applicationProcess",
          align: "left",
          label: this.$t("ProjectDashboard.applicationProcess"),
          field: (row) => this.getLastCompletedStep(row.project.applicationProcessSteps),
          sortable: true,
          style: `width: ${COLUMN_WIDTHS.applicationProcess}`,
          headerStyle: `width: ${COLUMN_WIDTHS.applicationProcess}`,
        },
        {
          name: "status",
          align: "left",
          label: this.$t("ProjectDashboard.status"),
          field: (row) => this.getStatusText(row.project.status),
          sortable: true,
          style: `width: ${COLUMN_WIDTHS.status}`,
          headerStyle: `width: ${COLUMN_WIDTHS.status}`,
        },
      ];
    },
    prioritizedProjects() {
      return this.$store.state.project.prioritizedProjects;
    },
    municipalityOptions() {
      return this.$store.state.municipality.municipalitiesSimplified;
    },
    showSection() {
      if (this.isAdmin || this.isLeader) return true;
      return this.prioritizedProjects.length > 0;
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
  },
  watch: {
    prioritizedProjects: {
      immediate: true,
      handler(val) {
        this.localList = [...(val || [])];
      },
    },
  },
  methods: {
    resolveProject(row) {
      return row.project;
    },
    async fetchList() {
      this.loading = true;
      const municipalityId = this.isAdmin ? this.selectedMunicipality?.id : undefined;
      if (this.isAdmin && !municipalityId) {
        this.loading = false;
        return;
      }
      await this.$store.dispatch("project/getPrioritizedProjects", { municipalityId });
      this.loading = false;
    },
    onMunicipalityChange() {
      this.fetchList();
    },
    async remove(row) {
      await this.$store.dispatch("project/removeFromPriorityList", { id: row.id });
      this.$emit("removed");
    },
    async persistOrder() {
      const order = this.localList.map((row) => row.id);
      await this.$store.dispatch("project/reorderPriorityList", { order });
    },
    onRowDragStart(row) {
      this.dragRow = row;
    },
    onRowDrop(targetRow) {
      if (!this.dragRow || this.dragRow.id === targetRow.id) return;
      const from = this.localList.findIndex((row) => row.id === this.dragRow.id);
      const to = this.localList.findIndex((row) => row.id === targetRow.id);
      const list = [...this.localList];
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      this.localList = list;
      this.dragRow = null;
      this.persistOrder();
    },
    formatDate(val) {
      return dateFormatter(val);
    },
    async view(project) {
      const id = project && project.id;
      if (!id) return;

      try {
        const validationResult = await this.$store.dispatch("project/validateApplicationAccess", id);

        if (validationResult.financialPlan) {
          this.$store.commit("project/setFinancialPlan", validationResult.financialPlan);
        }

        if (validationResult.accessGranted) {
          this.$router.push({ path: `/application/process/view/${id}` });
        } else {
          this.requestProjectId = id;
          this.requestDialog = true;
        }
      } catch (error) {
        console.error("Error in view function:", error);
        // API call failed - fall back to a best-effort client-side check using data
        // already on hand. Defaults to requiring access approval (fail closed) unless
        // the user is clearly the owner, an admin, or the project is open to all users.
        const isOwner = !!project.owner && !!this.loggedInUser && project.owner.id === this.loggedInUser.id;
        if (this.isAdmin || isOwner || project.visibility === "all users") {
          this.$router.push({ path: `/application/process/view/${id}` });
          return;
        }
        if (project.visibility === "listed only") {
          const hasReaderAccess =
            !!project.readers &&
            project.readers.some((user) => !!this.loggedInUser && user.id === this.loggedInUser.id);
          const hasEditorAccess =
            !!project.editors &&
            project.editors.some((user) => !!this.loggedInUser && user.id === this.loggedInUser.id);
          if (hasReaderAccess || hasEditorAccess) {
            this.$router.push({ path: `/application/process/view/${id}` });
            return;
          }
        }
        this.requestProjectId = id;
        this.requestDialog = true;
      }
    },
  },
  mounted() {
    if (!this.isAdmin) {
      this.fetchList();
    }
  },
};
</script>

<style lang="scss" scoped>
.priority-selector-border {
  border-bottom: 1px solid rgba(18, 54, 115, 0.1);
}

.priority-row:hover {
  background: $grey-1;
}

.priority-col-handle {
  width: 32px;
}
</style>
