<template>
  <q-expansion-item v-model="sectionExpanded" header-class="bg-blue-2 q-px-md"
    expand-icon-class="text-blue" class="q-mt-md q-mb-lg radius-20 shadow-1 overflow-hidden bg-white">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon name="mdi-clock-outline" color="blue" />
      </q-item-section>
      <q-item-section>
        <span class="font-16 text-weight-600 text-blue">{{ $t("ProjectDashboard.waitlist") }}</span>
      </q-item-section>
    </template>

    <q-table flat class="pagination-no-shadow" :class="filtersExpanded ? 'yellowBg' : ''"
      :data="applicationProcess || []" :columns="columns" row-key="name" :visible-columns="visibleColumns"
      :table-style="{ tableLayout: 'fixed' }" :pagination="{
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')" ref="table">
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th v-if="isLeader" auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props" :style="col.headerStyle" class="font-14 text-black">
            {{ col.label }}
          </q-th>
          <q-th :style="{ width: expandColumnWidth }" />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td v-if="isLeader" auto-width class="text-center">
            <q-btn size="md" color="blue" round dense flat icon="mdi-star-outline"
              :title="$t('ProjectDashboard.prioritize')" @click.stop="prioritizeRow(props.row)" />
          </q-td>
          <q-td @click="view(props.row)" v-for="col in props.cols" :key="col.name" :props="props" :style="col.style"
            class="font-14 cursor-pointer">
            <template v-if="col.name === 'applicationProcess'">
              <q-badge color="primary" class="text-white q-py-sm q-px-md" :style="stepBadgeStyle" v-if="!props.row.applicationProcessSteps">
                {{ $t("aiFundingCheck") }}
              </q-badge>
              <q-badge :color="getLastCompletedStepColor(props.row.applicationProcessSteps)"
                :text-color="getLastCompletedStepTextColor(props.row.applicationProcessSteps)"
                class="text-white q-py-sm q-px-md" :style="stepBadgeStyle" v-else>
                {{ getLastCompletedStep(props.row.applicationProcessSteps) }}
              </q-badge>
            </template>
            <template v-else-if="col.name === 'status'">
              <q-badge :color="getStatusColor(props.row.status)"
                :class="props.row.status === null ? 'text-black' : 'text-white'" class="q-py-sm q-px-md" :style="statusBadgeStyle">
                {{ getStatusText(props.row.status) }}
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
            <q-btn size="md" color="blue" round dense @click="toggleExpand(props.row)"
              :icon="isExpanded(props.row) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </q-td>
        </q-tr>
        <FinancialPlanRow :visible="isExpanded(props.row)" :financial-plan="getFinancialPlan(props.row)"
          :funding-matches="props.row.fundingMatches" :external-id="props.row.external_id" />
      </template>

    </q-table>
    <RequestAccessDialog :id="projectId" tab="projectIdeas" type="view" :dialogState="requestDialog"
      @update="(requestDialog = $event), (projectId = null), (itemType = null)" />
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
  mixins: [projectStatusLabels, applicationFilterOptions, financialPlanExpand],
  name: "projectDashboardTable",
  components: {
    RequestAccessDialog,
    FinancialPlanRow,
  },
  props: {
    search: { type: String, default: "" },
    selectedMunicipalities: { type: Array, default: null },
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
      sectionExpanded: true,
      searchTimeout: null,
      visibleColumns: ["title", "updatedAt", "location", "applicationProcess", "status"],
      requestDialog: false,
      filter: "",
      projectId: null,
    };
  },
  methods: {
    async getProjects() {
      // Create filters object with selected values
      const filters = {};

      // Add search term if present and has at least 3 characters
      const searchValue = this.search || '';
      if (searchValue.trim() && searchValue.trim().length >= 3) {
        filters.search = searchValue.trim();
      }

      // Add municipalities if selected (admin only)
      if (this.isAdmin && this.selectedMunicipalities && this.selectedMunicipalities.length) {
        filters.municipality = this.selectedMunicipalities.map(item => item.id || item).join(',');
      }

      // Add locations if selected
      if (this.selectedLocations && this.selectedLocations.length) {
        filters.location = this.selectedLocations.map(item => item.title || item).join(',');
      }

      // Add status if selected
      if (this.selectedStatus && this.selectedStatus.length) {
        filters.status = this.selectedStatus.map(item => item.value !== undefined ? item.value : item).join(',');
      }

      // Add investive filter if selected
      if (this.selectedInvestive && this.selectedInvestive.length) {
        filters.investive = this.selectedInvestive.map(item => item.value !== undefined ? item.value : item).join(',');
      }

      // Add categories if selected
      if (this.selectedCategories && this.selectedCategories.length) {
        filters.categories = this.selectedCategories.map(item => item.id || item).join(',');
      }

      // Add tags if selected
      if (this.tagsKeywords && this.tagsKeywords.length) {
        filters.tags = this.tagsKeywords.map(item => item.id || item).join(',');
      }

      // Add application steps if selected
      if (this.selectedApplicationSteps && this.selectedApplicationSteps.length) {
        filters.applicationStep = this.selectedApplicationSteps.map(item => item.value || item).join(',');
      }

      // Get project application process data with filters
      await this.$store.dispatch("project/getApplicationProcess", filters);
    },
    async prioritizeRow(row) {
      await this.$store.dispatch("project/addToPriorityList", { id: row.id });
      this.getProjects();
      this.updateDashboardStats();
    },

    async updateDashboardStats() {
      // Create filters object with selected values (same logic as getProjects)
      const filters = {};

      // Add search term if present and has at least 3 characters
      const searchValue = this.search || '';
      if (searchValue.trim() && searchValue.trim().length >= 3) {
        filters.search = searchValue.trim();
      }

      // Add municipalities if selected (admin only)
      if (this.isAdmin && this.selectedMunicipalities && this.selectedMunicipalities.length) {
        filters.municipality = this.selectedMunicipalities.map(item => item.id || item).join(',');
      }

      // Add locations if selected
      if (this.selectedLocations && this.selectedLocations.length) {
        filters.location = this.selectedLocations.map(item => item.title || item).join(',');
      }

      // Add status if selected
      if (this.selectedStatus && this.selectedStatus.length) {
        filters.status = this.selectedStatus.map(item => item.value !== undefined ? item.value : item).join(',');
      }

      // Add investive filter if selected
      if (this.selectedInvestive && this.selectedInvestive.length) {
        filters.investive = this.selectedInvestive.map(item => item.value !== undefined ? item.value : item).join(',');
      }

      // Add categories if selected
      if (this.selectedCategories && this.selectedCategories.length) {
        filters.categories = this.selectedCategories.map(item => item.id || item).join(',');
      }

      // Add tags if selected
      if (this.tagsKeywords && this.tagsKeywords.length) {
        filters.tags = this.tagsKeywords.map(item => item.id || item).join(',');
      }

      // Add application steps if selected
      if (this.selectedApplicationSteps && this.selectedApplicationSteps.length) {
        filters.applicationStep = this.selectedApplicationSteps.map(item => item.value || item).join(',');
      }

      // Update dashboard stats with current filters
      await this.$store.dispatch("project/getProjectDashboardStats", filters);
    },
    async view(row) {
      const id = row && row.id;
      this.itemId = row && row.id;

      try {
        // Validate access using the new API
        const validationResult = await this.$store.dispatch("project/validateApplicationAccess", id);

        // Store financial plan from the validation response
        if (validationResult.financialPlan) {
          this.$store.commit("project/setFinancialPlan", validationResult.financialPlan);
        }

        if (validationResult.accessGranted) {
          // Access is granted by the API, navigate to the view
          this.$router.push({ path: `/application/process/view/${id}` });
        } else {
          // Access is denied, show request dialog
          this.itemId = id;
          this.itemType = "view";
          this.requestDialog = true;
        }
      } catch (error) {
        console.error("Error in view function:", error);
        // API call failed - fall back to a best-effort client-side check using data
        // already on hand. Defaults to requiring access approval (fail closed) unless
        // the user is clearly the owner, an admin, or the project is open to all users.
        const isOwner = !!row.owner && !!this.loggedInUser && row.owner.id === this.loggedInUser.id;
        if (this.isAdmin || isOwner || row.visibility === "all users") {
          this.$router.push({ path: `/application/process/view/${id}` });
          return;
        }
        if (row.visibility === "listed only") {
          const hasReaderAccess =
            !!row.readers && row.readers.some((user) => !!this.loggedInUser && user.id === this.loggedInUser.id);
          const hasEditorAccess =
            !!row.editors && row.editors.some((user) => !!this.loggedInUser && user.id === this.loggedInUser.id);
          if (hasReaderAccess || hasEditorAccess) {
            this.$router.push({ path: `/application/process/view/${id}` });
            return;
          }
        }
        this.itemId = id;
        this.itemType = "view";
        this.requestDialog = true;
      }
    },
  },
  computed: {
    columns() {
      return [
        {
          name: "title",
          required: true,
          label: this.$t("ProjectDashboard.title"),
          align: "left",
          field: "title",
          sortable: true,
          style: "overflow: hidden; white-space: nowrap; text-overflow: ellipsis;",
        },
        {
          name: "updatedAt",
          align: "center",
          label: this.$t("Speicherdatum"),
          field: "updatedAt",
          sortable: true,
          format: (val) => (val ? dateFormatter(val) : ""),
          style: `width: ${COLUMN_WIDTHS.updatedAt}`,
          headerStyle: `width: ${COLUMN_WIDTHS.updatedAt}`,
        },
        {
          name: "location",
          align: "left",
          label: this.$t("ProjectDashboard.locations"),
          field: (row) => row.info?.location,
          sortable: true,
          style: `width: ${COLUMN_WIDTHS.location}; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;`,
          headerStyle: `width: ${COLUMN_WIDTHS.location}`,
        },
        {
          name: "applicationProcess",
          align: "left",
          label: this.$t("ProjectDashboard.applicationProcess"),
          field: "applicationProcessSteps",
          sortable: true,
          style: `width: ${COLUMN_WIDTHS.applicationProcess}`,
          headerStyle: `width: ${COLUMN_WIDTHS.applicationProcess}`,
        },
        {
          name: "status",
          align: "left",
          label: this.$t("ProjectDashboard.status"),
          field: "status",
          sortable: true,
          style: `width: ${COLUMN_WIDTHS.status}`,
          headerStyle: `width: ${COLUMN_WIDTHS.status}`,
        },
      ];
    },
    expandColumnWidth() {
      return COLUMN_WIDTHS.expand;
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
    applicationProcess() {
      return this.$store.state.project.applicationProcess;
    },
  },
  mounted() {
    this.getProjects();

    // Apply saved pagination settings
    this.$nextTick(() => {
      if (localStorage.getItem("pagination") && this.$refs.table) {
        try {
          const savedPagination = JSON.parse(localStorage.getItem("pagination"));
          this.$refs.table.setPagination({
            page: savedPagination.projectDashboardPage || 1,
            rowsPerPage: savedPagination.projectDashboardRowsPerPage || 10,
          });
        } catch (error) {
          console.error("Error applying saved pagination:", error);
        }
      }
    });
  },
  beforeDestroy() {
    // Save pagination settings
    if (this.$refs.table) {
      try {
        const pagination = JSON.parse(localStorage.getItem("pagination") || "{}");
        const localPagination = {
          projectDashboardPage: this.$refs.table.computedPagination.page,
          projectDashboardRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
        };
        const paginationToSave = { ...pagination, ...localPagination };
        localStorage.setItem("pagination", JSON.stringify(paginationToSave));
      } catch (error) {
        console.error("Error saving pagination:", error);
      }
    }
  },
  watch: {
    search: {
      handler: function (val) {
        // Using debounce to avoid too many API calls while typing
        clearTimeout(this.searchTimeout);

        // Handle null or undefined values
        const searchValue = val || '';

        // Only trigger search if input is at least 3 characters or empty (to reset search)
        if (searchValue.trim().length >= 3 || searchValue.trim() === '') {
          this.searchTimeout = setTimeout(() => {
            this.getProjects();
            this.updateDashboardStats();
          }, 500); // Wait for 500ms after typing stops
        }
      }
    },
    selectedMunicipalities() {
      this.getProjects();
      this.updateDashboardStats();
    },
    selectedLocations() {
      this.getProjects();
      this.updateDashboardStats();
    },
    selectedStatus() {
      this.getProjects();
      this.updateDashboardStats();
    },
    selectedInvestive() {
      this.getProjects();
      this.updateDashboardStats();
    },
    selectedCategories() {
      this.getProjects();
      this.updateDashboardStats();
    },
    tagsKeywords() {
      this.getProjects();
      this.updateDashboardStats();
    },
    selectedApplicationSteps() {
      this.getProjects();
      this.updateDashboardStats();
    },
  },
};
</script>
