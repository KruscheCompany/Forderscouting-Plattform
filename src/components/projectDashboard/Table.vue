<template>
  <div class="q-my-lg">
    <q-table class="radius-20 shadow-1 pagination-no-shadow" :class="expanded ? 'yellowBg' : ''"
      :data="applicationProcess || []" :columns="columns" row-key="name" :visible-columns="visibleColumns" :pagination="{
        sortBy: 'updatedAt',
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

              <div class="col-6 col-md-4" v-if="isAdmin">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.municipalities") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="municipalityOptions" v-model="selectedMunicipalities"
                  option-value="id" option-label="title">
                </q-select>
              </div>

              <div class="col-6 col-md-4">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.applicationProcess") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="applicationStepOptions"
                  v-model="selectedApplicationSteps" option-value="value" option-label="title">
                </q-select>
              </div>

              <div class="col-6 col-md-4">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.status") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="statusOptions" v-model="selectedStatus"
                  option-value="value" option-label="title">
                </q-select>
              </div>

              <div class="col-6" :class="isAdmin ? 'col-md-3' : 'col-md-4'">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.locations") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="locationOptions" v-model="selectedLocations"
                  option-value="title" option-label="title">
                </q-select>
              </div>

              <div class="col-6" :class="isAdmin ? 'col-md-3' : 'col-md-4'">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.investive") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="investiveOptions" v-model="selectedInvestive"
                  option-value="value" option-label="title">
                </q-select>
              </div>

              <div class="col-6" :class="isAdmin ? 'col-md-3' : 'col-md-4'">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("ProjectDashboard.categories") }}
                </p>
                <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                  :label="$t('Search')" multiple filled :options="categoryOptions" v-model="selectedCategories"
                  option-value="id" option-label="title">
                </q-select>
              </div>

              <div class="col-6" :class="isAdmin ? 'col-md-3' : 'col-md-4'">
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
              <q-badge :color="getLastCompletedStepColor(props.row.applicationProcessSteps)"
                :text-color="getLastCompletedStepTextColor(props.row.applicationProcessSteps)"
                class="text-white q-py-sm q-px-md" v-else>
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
          <q-td auto-width class="text-center">
            <q-btn size="md" color="blue" round dense @click="toggleExpand(props.row)"
              :icon="isExpanded(props.row) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </q-td>
        </q-tr>
        <q-tr class="financial-plan-container" v-show="isExpanded(props.row)" :props="props">
          <q-td colspan="100%">
            <div class="text-left q-pa-md">
              <template v-if="props.row.financialPlan && props.row.financialPlan.costAndFinance">
                <div v-for="item in props.row.financialPlan.costAndFinance" :key="item.id">
                  <div class="row">
                    <p class="font-14 text-weight-bold text-blue q-mb-none">{{ item.title }}: </p>
                    <p class="font-14 text-blue q-ml-sm q-mb-none">{{ formatCurrency(item.value) }}</p>
                    <p v-if="item.title === 'Fördermittel'"
                      class="font-14 text-blue q-ml-sm q-mb-none text-weight-bold">{{
                        getSelectedFunding(props.row) }}</p>
                    <q-btn v-if="item.title === 'Fördermittel'" flat dense round size="sm"
                      icon="mdi-arrow-top-right-thin-circle-outline"
                      @click.stop="openFundingLink(props.row.external_id)" class="funding-link-btn"
                      :disabled="!props.row.external_id" />
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
import { dateFormatter } from "src/boot/dateFormatter";
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
      visibleColumns: ["title", "updatedAt", "applicationProcess", "status"],
      requestDialog: false,
      filter: "",
      projectId: null,
      selectedCategories: null,
      selectedStatus: null,
      selectedInvestive: null,
      selectedMunicipalities: null,
      selectedLocations: null,
      selectedApplicationSteps: null,
      tagsKeywords: null,
      statusOptions: [
        { value: true, title: this.$t('Zuwendungsbescheid') },
        { value: false, title: this.$t('Ablehnungsbescheid') },
        { value: null, title: this.$t('In Bearbeitung') }
      ],
      investiveOptions: [
        { value: true, title: "Yes" },
        { value: false, title: "No" },
      ],
      applicationStepOptions: [
        { value: "aiFundingCheck", title: this.$t('aiFundingCheck') },
        { value: "projectDevelopment", title: this.$t('projectDevelopment') },
        { value: "application", title: this.$t('application') }
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
    async getCategories() {
      await this.$store.dispatch("category/getSimplifiedCategories");
    },
    async getTags() {
      await this.$store.dispatch("tag/getSimplifiedTags");
    },
    async getMunicipalities() {
      await this.$store.dispatch("municipality/getSimplifiedMunicipalities");
    },
    async getLocations() {
      // Only send municipality ID if a municipality is selected
      const params = {};

      // If admin has selected municipalities, send all as comma-separated
      if (this.isAdmin && this.selectedMunicipalities && this.selectedMunicipalities.length) {
        params.municipalityId = this.selectedMunicipalities.map(item => item.id || item).join(',');
      }

      await this.$store.dispatch("municipality/getLocationsByMunicipality", params);
    },
    getLastCompletedStepColor(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return 'primary'; // Default color
      }

      // Filter the steps that are done
      const completedSteps = applicationProcessSteps.filter(step => step.done);

      // If no completed steps, return default
      if (completedSteps.length === 0) {
        return 'primary';
      }

      // Get the last completed step
      const lastCompletedStep = completedSteps[completedSteps.length - 1];

      // Determine color based on the name of the last completed step
      switch (lastCompletedStep.name) {
        case 'aiFundingCheck':
          return 'primary'; // Blue
        case 'projectDevelopment':
          return 'blue-2'; // Light Blue
        case 'application':
          return 'blue-1'; // Green
        default:
          return 'primary'; // Default color
      }
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
      const translationKey = `${lastCompletedStep.name}`;
      return this.$t(translationKey) ? this.$t(translationKey) : (lastCompletedStep.title || this.$t("aiFundingCheck"));
    },

    getLastCompletedStepTextColor(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return 'white'; // Default text color
      }

      // Filter the steps that are done
      const completedSteps = applicationProcessSteps.filter(step => step.done);

      // If no completed steps, return default
      if (completedSteps.length === 0) {
        return 'white';
      }

      // Get the last completed step
      const lastCompletedStep = completedSteps[completedSteps.length - 1];

      // Determine text color based on the name of the last completed step
      switch (lastCompletedStep.name) {
        case 'aiFundingCheck':
          return 'white'; // Blue badge - white text
        case 'projectDevelopment':
          return 'black'; // Light Blue badge - black text
        case 'application':
          return 'black'; // Green badge - black text
        default:
          return 'white'; // Default text color
      }
    },

    getStatusText(status) {
      if (status === "sentToFunding") {
        return this.$t('projectComponents.submissionSigning.sentToFunding');
      } else if (status === "grantNotice") {
        return this.$t('Zuwendungsbescheid'); // Granted
      } else if (status === "rejectionNotice") {
        return this.$t('Ablehnungsbescheid'); // Rejected
      } else {
        return this.$t('In Bearbeitung'); // In progress (null)
      }
    },

    getStatusColor(status) {
      if (status === "grantNotice") {
        return 'green'; // Granted - green badge
      } else if (status === "rejectionNotice") {
        return 'red'; // Rejected - red badge
      } else if (status === "sentToFunding") {
        return 'blue'; // Sent to funding - blue badge
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
    getSelectedFunding(row) {
      const funding = row.fundingMatches.find(funding => funding.selected);
      return funding ? funding.title : '';
    },
    openFundingLink(externalId) {
      if (externalId) {
        // Construct URL to funding details page
        const url = `/user/newFunding/${externalId}`;
        window.open(url, '_blank');
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
          name: "updatedAt",
          align: "center",
          label: this.$t("Speicherdatum"),
          field: "updatedAt",
          sortable: true,
          format: (val) => (val ? dateFormatter(val) : ""),
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
    municipalityOptions() {
      return this.$store.state.municipality.municipalitiesSimplified;
    },
  },
  mounted() {
    // Load saved filters from localStorage
    try {
      const savedFilters = JSON.parse(localStorage.getItem("projectDashboardFilters") || "{}");

      // Apply saved filters if they exist
      if (savedFilters) {
        if (savedFilters.search) this.search = savedFilters.search;

        if (savedFilters.selectedCategories) {
          this.selectedCategories = savedFilters.selectedCategories;
        }

        if (savedFilters.selectedStatus) {
          this.selectedStatus = savedFilters.selectedStatus;
        }

        if (savedFilters.selectedInvestive) {
          this.selectedInvestive = savedFilters.selectedInvestive;
        }

        if (savedFilters.selectedLocations) {
          this.selectedLocations = savedFilters.selectedLocations;
        }

        if (this.isAdmin && savedFilters.selectedMunicipalities) {
          this.selectedMunicipalities = savedFilters.selectedMunicipalities;
        }

        if (savedFilters.tagsKeywords) {
          this.tagsKeywords = savedFilters.tagsKeywords;
        }

        if (savedFilters.selectedApplicationSteps) {
          this.selectedApplicationSteps = savedFilters.selectedApplicationSteps;
        }

        if (savedFilters.expanded !== undefined) {
          this.expanded = savedFilters.expanded;
        }
      }
    } catch (error) {
      console.error("Error loading saved filters:", error);
    }

    // Load required data
    this.getCategories();
    this.getTags();

    // Only fetch municipalities for admin users
    if (this.isAdmin) {
      this.getMunicipalities();
    }

    // Get locations and projects after loading municipalities
    this.$nextTick(() => {
      this.getLocations();
      this.getProjects(); // This will also update dashboard stats
    });

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
    // Save filter selections
    try {
      const filtersToSave = {
        search: this.search || "",
        selectedCategories: this.selectedCategories || null,
        selectedStatus: this.selectedStatus || null,
        selectedInvestive: this.selectedInvestive || null,
        selectedLocations: this.selectedLocations || null,
        selectedMunicipalities: this.selectedMunicipalities || null,
        selectedApplicationSteps: this.selectedApplicationSteps || null,
        tagsKeywords: this.tagsKeywords || null,
        expanded: this.expanded
      };

      localStorage.setItem("projectDashboardFilters", JSON.stringify(filtersToSave));
    } catch (error) {
      console.error("Error saving filters:", error);
    }

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
      this.getLocations();
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

<style lang="scss">
.yellowBg .q-table__top {
  background: $yellow-10;
  transition: all 0.2s ease-in-out;
}

.financial-plan {
  // background: white;
  min-height: 105px;
  max-height: 105px;

  &-container {
    background-color: #f5f5f5;
  }
}
</style>
