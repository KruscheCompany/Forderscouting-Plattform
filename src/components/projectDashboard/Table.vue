<template>
  <div class="q-my-lg">
    <q-table v-if="applicationProcess && applicationProcess.length" class="radius-20 shadow-1 pagination-no-shadow"
      :class="expanded ? 'yellowBg' : ''" :data="applicationProcess" :columns="columns" row-key="name"
      :visible-columns="visibleColumns" :pagination="{
        sortBy: 'title',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')" ref="table">
      <template v-slot:top>
        <div class="col-12">
          <q-expansion-item header-class="no-padding items-center" expand-icon-class="hidden" v-model="expanded"
            expand-icon-toggle>
            <template v-slot:header>
              <div class="col-8 col-md-4">
                <q-input clearable borderless outlined class="bg-white input-radius-6 no-shadow q-mb-sm q-mt-sm"
                  v-model="search" :placeholder="$t('Search')" dense role="searchbox">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-md-4 text-right">
                <q-btn no-caps @click="expanded = !expanded" icon="filter_alt" color="primary" class="radius-6" flat
                  label="Filter">
                </q-btn>
              </div>
            </template>

            <div class="row q-px-xs q-mt-md q-col-gutter-x-lg">

              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.locations") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="locationOptions" v-model="selectedLocations"
                  option-value="title" option-label="title">
                </q-select>
              </div>

              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.status") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="statusOptions" v-model="selectedStatus"
                  option-value="value" option-label="title">
                </q-select>
              </div>

              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.investive") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="investiveOptions" v-model="selectedInvestive"
                  option-value="value" option-label="title">
                </q-select>
              </div>

              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.categories") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="categoryOptions" v-model="selectedCategories"
                  option-value="id" option-label="title">
                </q-select>
              </div>

              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("Tags") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="tagKeywordsOptions" v-model="tagsKeywords"
                  option-value="id" option-label="title">
                </q-select>
              </div>

            </div>
          </q-expansion-item>
        </div>
      </template>

      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-14 text-black">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td @click="view(props.row)" auto-width v-for="col in props.cols" :key="col.name" :props="props"
            class="font-14 cursor-pointer">
            <template v-if="col.name === 'applicationProcess'">
              <q-badge color="primary" class="text-white q-py-sm q-px-md" v-if="!props.row.applicationProcessSteps">
                {{ $t("aiFundingCheck") }}
              </q-badge>
              <q-badge color="primary" class="text-white q-py-sm q-px-md" v-else>
                {{ getLastCompletedStep(props.row.applicationProcessSteps) }}
              </q-badge>
            </template>
            <template v-else-if="col.name === 'status'">
              <q-badge :color="getStatusColor(props.row.status)"
                :class="props.row.status === null ? 'text-black' : 'text-white'" class="q-py-sm q-px-md">
                {{ getStatusText(props.row.status) }}
              </q-badge>
            </template>
            <template v-else>
              {{
                col.value && col.value.length > 48
                  ? col.value.substring(0, 48) + "..."
                  : col.value
              }}
            </template>
          </q-td>
          <q-td auto-width class="text-center">
            <q-btn size="md" color="blue" round dense @click="toggleExpand(props.row)"
              :icon="isExpanded(props.row) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </q-td>
        </q-tr>
        <q-tr v-show="isExpanded(props.row)" :props="props">
          <q-td colspan="100%">
            <div class="text-left q-pa-md">
              <template v-if="props.row.financialPlan && props.row.financialPlan.costAndFinance">
                <div class="text-h6 q-mb-md">{{ $t('ProjectDashboard.financialPlan') }}</div>
                <div class="row q-col-gutter-md">
                  <div v-for="item in props.row.financialPlan.costAndFinance" :key="item.id"
                    class="col-12 col-sm-6 col-md-3">
                    <div class="radius-20 q-pa-md financial-plan" style="height: 130px">
                      <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none">{{ item.title }}</p>
                      <p class="font-24 text-weight-bold text-blue q-mb-sm">{{ formatCurrency(item.value) }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="text-black">{{ $t('ProjectDashboard.noFinancialData') }}</div>
            </div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
    <RequestAccessDialog :id="projectId" tab="projectIdeas" type="view" :dialogState="requestDialog"
      @update="(requestDialog = $event), (projectId = null), (itemType = null)" />
  </div>
</template>

<script>
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
export default {
  name: "projectDashboardTable",
  components: {
    RequestAccessDialog,
  },
  data() {
    return {
      expanded: false,
      expandedRows: {}, // To track expanded rows individually
      search: "",
      searchTimeout: null,
      visibleColumns: ["title", "applicationProcess", "status"],
      requestDialog: false,
      filter: "",
      projectId: null,
      selectedCategories: null,
      selectedStatus: null,
      selectedInvestive: null,
      selectedLocations: null,
      tagsKeywords: null,
      statusOptions: [
        { value: true, title: "Granted" },
        { value: false, title: "Rejected" },
        { value: null, title: "In Progress" }
      ],
      investiveOptions: [
        { value: true, title: "Yes" },
        { value: false, title: "No" },
      ],
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

      // Get project application process data with filters
      await this.$store.dispatch("project/getApplicationProcess", filters);
    },
    async getCategories() {
      await this.$store.dispatch("category/getSimplifiedCategories");
    },
    async getTags() {
      await this.$store.dispatch("tag/getSimplifiedTags");
    },
    async getLocations() {
      await this.$store.dispatch("municipality/getLocationsByMunicipality", { skipAdminPrivileges: true });
    },
    getLastCompletedStep(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return this.$t("aiFundingCheck");
      }

      // Filter the steps that are done
      const completedSteps = applicationProcessSteps.filter(step => step.done);

      // If no completed steps, return default
      if (completedSteps.length === 0) {
        return this.$t("aiFundingCheck");
      }

      // Get the last completed step
      const lastCompletedStep = completedSteps[completedSteps.length - 1];

      // Try to use translation key based on the name property first
      // If not available, use the title directly, and if that's not available either, use a default
      const translationKey = `ProjectDashboard.${lastCompletedStep.name}`;
      return this.$te(translationKey) ? this.$t(translationKey) : (lastCompletedStep.title || this.$t("aiFundingCheck"));
    },

    getStatusText(status) {
      if (status === true) {
        return this.$t('Zuwendungsbescheid'); // Granted
      } else if (status === false) {
        return this.$t('Ablehnungsbescheid'); // Rejected
      } else {
        return this.$t('In Bearbeitung'); // In progress (null)
      }
    },

    getStatusColor(status) {
      if (status === true) {
        return 'green'; // Granted - green badge
      } else if (status === false) {
        return 'red'; // Rejected - red badge
      } else {
        return 'yellow'; // In progress - yellow badge
      }
    },

    // Track expanded rows using unique IDs
    async toggleExpand(row) {
      const rowId = row.id || row.name; // Use ID or name as unique identifier

      // If already expanded, just collapse it
      if (this.expandedRows[rowId]) {
        this.$set(this.expandedRows, rowId, false);
        return;
      }

      // If not expanded, validate access before expanding
      try {
        // Validate access using the API
        const validationResult = await this.$store.dispatch("project/validateApplicationAccess", rowId);

        // If access is granted, store the financial data and expand the row
        if (validationResult.accessGranted) {
          // Update the row's financial plan with data from API
          if (validationResult.financialPlan) {
            // Update financial plan in Vuex store
            this.$store.commit("project/setFinancialPlan", validationResult.financialPlan);

            // Update the current row's financial plan data for display
            // We need to use Vue's reactivity system to ensure the UI updates
            const updatedRow = { ...row, financialPlan: validationResult.financialPlan };

            // Find index of the row in application process and update it
            if (this.applicationProcess) {
              const index = this.applicationProcess.findIndex(item => item.id === rowId);
              if (index !== -1) {
                const updatedProcess = [...this.applicationProcess];
                updatedProcess[index] = updatedRow;
                this.$store.commit("project/setApplicationProcess", updatedProcess);
              }
            }
          }

          // Expand the row
          this.$set(this.expandedRows, rowId, true);
        } else {
          // If access is denied, show a notification
          this.$q.notify({
            type: "negative",
            message: this.$t("ProjectDashboard.accessDenied") || "Access denied to financial information"
          });

          // Keep row collapsed
          this.$set(this.expandedRows, rowId, false);
        }
      } catch (error) {
        console.error("Error validating access for financial data:", error);
        this.$q.notify({
          type: "negative",
          message: this.$t("ProjectDashboard.accessError") || "Error checking access permissions"
        });

        // Keep row collapsed on error
        this.$set(this.expandedRows, rowId, false);
      }
    },

    isExpanded(row) {
      const rowId = row.id || row.name; // Use ID or name as unique identifier
      return !!this.expandedRows[rowId];
    },
    formatCurrency(value) {
      if (!value || value === '') {
        return 0;
      }

      // Convert to number if it's a string
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[.,]/g, match => match === ',' ? '.' : '')) : value;

      if (isNaN(numValue)) {
        return value; // Return original value if not a number
      }

      // Format using German locale (thousands: ".", decimal: ",")
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numValue);
    },

    async updateDashboardStats() {
      // Create filters object with selected values (same logic as getProjects)
      const filters = {};

      // Add search term if present and has at least 3 characters
      const searchValue = this.search || '';
      if (searchValue.trim() && searchValue.trim().length >= 3) {
        filters.search = searchValue.trim();
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
        // Default to the old permission check in case of API failure
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/application/process/view/${id}` });
          } else {
            this.itemId = id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/application/process/view/${id}` });
        }
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
        },
        {
          name: "applicationProcess",
          align: "left",
          label: this.$t("ProjectDashboard.applicationProcess"),
          field: "applicationProcessSteps",
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: this.$t("ProjectDashboard.status"),
          field: "status",
          sortable: true,
        },
      ];
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
    applicationProcess() {
      return this.$store.state.project.applicationProcess;
    },
    categoryOptions() {
      return this.$store.state.category.categoriesSimplified;
    },
    tagKeywordsOptions() {
      return this.$store.state.tag.tagsSimplified;
    },
    locationOptions() {
      return this.$store.state.municipality.locationsSimplified;
    },
  },
  mounted() {
    this.getProjects(); // This will now also call getProjectDashboardStats
    this.getCategories();
    this.getTags();
    this.getLocations();

    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
        page: savedPagination.projectDashboardPage || 1,
        rowsPerPage: savedPagination.projectDashboardRowsPerPage || 10,
      });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      projectDashboardPage: this.$refs.table.computedPagination.page,
      projectDashboardRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
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
  },
};
</script>

<style lang="scss">
.yellowBg .q-table__top {
  background: $yellow-10;
  transition: all 0.2s ease-in-out;
}

.financial-plan {
  background: #f5f5f5;
  min-height: 160px;
  max-height: 160px;
  border: 2px solid transparent;
}
</style>
