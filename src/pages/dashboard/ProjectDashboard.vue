<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-2" v-for="(stat, index) in statistics" :key="index">
        <div class="shadow-2 radius-20 q-pa-md stat-card"
          :class="index === 0 ? 'total-projects' : index === 1 ? 'bg-yellow' : ''">
          <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none text-overflow">{{ stat.title }}</p>
          <p class="stat-value text-weight-bold text-blue q-mb-sm">{{ stat.value }}</p>
        </div>
      </div>
    </div>
    <ApplicationTableFilters :expanded.sync="filtersExpanded" :search.sync="search" :is-admin="isAdmin"
      :municipality-options="municipalityOptions" :application-step-options="applicationStepOptions"
      :status-options="statusOptions" :investive-options="investiveOptions" :category-options="categoryOptions"
      :tag-keywords-options="tagKeywordsOptions" :location-options="locationOptions"
      :selected-municipalities.sync="selectedMunicipalities" :selected-application-steps.sync="selectedApplicationSteps"
      :selected-status.sync="selectedStatus" :selected-locations.sync="selectedLocations"
      :selected-investive.sync="selectedInvestive" :selected-categories.sync="selectedCategories"
      :tags-keywords.sync="tagsKeywords" class="bg-white radius-20 shadow-1 q-pa-md q-mt-lg q-mb-lg" />

    <priorityTable @removed="onPriorityRemoved" :search="search" :filters-expanded="filtersExpanded"
      :selected-application-steps="selectedApplicationSteps" :selected-status="selectedStatus"
      :selected-locations="selectedLocations" :selected-investive="selectedInvestive"
      :selected-categories="selectedCategories" :tags-keywords="tagsKeywords" />
    <projectDashboardTable ref="dashboardTable" @stats="(val) => (statsData = val)" :search="search"
      :filters-expanded="filtersExpanded" :selected-municipalities="selectedMunicipalities"
      :selected-application-steps="selectedApplicationSteps" :selected-status="selectedStatus"
      :selected-locations="selectedLocations" :selected-investive="selectedInvestive"
      :selected-categories="selectedCategories" :tags-keywords="tagsKeywords" />
    <archivedProjectsTable v-if="isLeader || isAdmin" @unarchived="onProjectUnarchived" :search="search"
      :filters-expanded="filtersExpanded" :selected-municipalities="selectedMunicipalities"
      :selected-application-steps="selectedApplicationSteps" :selected-status="selectedStatus"
      :selected-locations="selectedLocations" :selected-investive="selectedInvestive"
      :selected-categories="selectedCategories" :tags-keywords="tagsKeywords" />
  </q-page>
</template>

<script>
import projectDashboardTable from "components/projectDashboard/Table.vue";
import archivedProjectsTable from "components/projectDashboard/ArchivedTable.vue";
import priorityTable from "components/projectDashboard/PriorityTable.vue";
import ApplicationTableFilters from "components/projectDashboard/ApplicationTableFilters.vue";
import applicationFilterOptions from "src/mixins/applicationFilterOptions";
export default {
  name: "projectDashboard",
  mixins: [applicationFilterOptions],
  data() {
    return {
      statsData: {},
      filtersExpanded: false,
      search: "",
      selectedCategories: null,
      selectedStatus: null,
      selectedInvestive: null,
      selectedMunicipalities: null,
      selectedLocations: null,
      selectedApplicationSteps: null,
      tagsKeywords: null,
    };
  },
  components: {
    projectDashboardTable,
    archivedProjectsTable,
    priorityTable,
    ApplicationTableFilters,
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
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
    statistics() {
      return [
        {
          title: this.$t("ProjectDashboard.totalProjects"),
          value: this.stats?.totalProjects,
        },
        {
          title: this.$t("ProjectDashboard.activeProjects"),
          value: this.stats?.activeProjects,
        },
        {
          title: this.$t("ProjectDashboard.totalInvestment"),
          value: this.formatCurrency(this.stats?.financialSums.gesamtinvestition),
        },
        {
          title: this.$t("ProjectDashboard.grants"),
          value: this.formatCurrency(this.stats?.financialSums.foerdermittel),
        },
        {
          title: this.$t("ProjectDashboard.ownFunds"),
          value: this.formatCurrency(this.stats?.financialSums.Eigenmittel),
        },
        {
          title: this.$t("ProjectDashboard.thirdPartyFunds"),
          value: this.formatCurrency(this.stats?.financialSums.Drittmittel),
        },
      ];
    },
    stats() {
      return this.$store.state.project.projectDashboardStats;
    }
  },
  methods: {
    getProjectDashboardStats() {
      this.$store.dispatch("project/getProjectDashboardStats");
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
      const params = {};
      if (this.isAdmin && this.selectedMunicipalities && this.selectedMunicipalities.length) {
        params.municipalityId = this.selectedMunicipalities.map((item) => item.id || item).join(',');
      }
      await this.$store.dispatch("municipality/getLocationsByMunicipality", params);
    },
    onPriorityRemoved() {
      this.$refs.dashboardTable.getProjects();
      this.$refs.dashboardTable.updateDashboardStats();
    },
    onProjectUnarchived() {
      this.$refs.dashboardTable.getProjects();
      this.$refs.dashboardTable.updateDashboardStats();
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
  },
  created() {
    try {
      const savedFilters = JSON.parse(localStorage.getItem("projectDashboardFilters") || "{}");

      if (savedFilters.search) this.search = savedFilters.search;
      if (savedFilters.selectedCategories) this.selectedCategories = savedFilters.selectedCategories;
      if (savedFilters.selectedStatus) this.selectedStatus = savedFilters.selectedStatus;
      if (savedFilters.selectedInvestive) this.selectedInvestive = savedFilters.selectedInvestive;
      if (savedFilters.selectedLocations) this.selectedLocations = savedFilters.selectedLocations;
      if (this.isAdmin && savedFilters.selectedMunicipalities) this.selectedMunicipalities = savedFilters.selectedMunicipalities;
      if (savedFilters.tagsKeywords) this.tagsKeywords = savedFilters.tagsKeywords;
      if (savedFilters.selectedApplicationSteps) this.selectedApplicationSteps = savedFilters.selectedApplicationSteps;
      if (savedFilters.expanded !== undefined) this.filtersExpanded = savedFilters.expanded;
    } catch (error) {
      console.error("Error loading saved filters:", error);
    }
  },
  mounted() {
    this.getProjectDashboardStats();
    this.getCategories();
    this.getTags();

    if (this.isAdmin) {
      this.getMunicipalities();
    }

    this.getLocations();
  },
  beforeDestroy() {
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
        expanded: this.filtersExpanded,
      };

      localStorage.setItem("projectDashboardFilters", JSON.stringify(filtersToSave));
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  },
  watch: {
    selectedMunicipalities() {
      this.getLocations();
    },
  },
};
</script>

<style lang="scss">
.total-projects {
  background: #bfd3ff;

  p {
    color: black !important;
  }
}

.stat-card {
  min-height: 105px;
}

.stat-value {
  font-size: 24px;
  overflow-wrap: break-word;
  word-break: break-word;

  @media (max-width: 599px) {
    font-size: 18px;
  }
}
</style>
