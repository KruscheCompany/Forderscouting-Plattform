<template>
  <q-expansion-item v-model="expanded" @show="fetchArchivedProjects" header-class="bg-red-1 q-px-md"
    expand-icon-class="text-blue" class="q-mt-md q-mb-lg radius-20 shadow-1 overflow-hidden bg-white">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon name="inventory" color="red-9" />
      </q-item-section>
      <q-item-section>
        <span class="font-16 text-weight-600 text-red-9">{{ $t("ProjectDashboard.archivedApplications") }}</span>
      </q-item-section>
    </template>

    <q-table flat class="pagination-no-shadow" :class="filtersExpanded ? 'yellowBg' : ''"
      :data="archivedProjects" :columns="columns"
      row-key="id" :loading="loading" :table-style="{ tableLayout: 'fixed' }" :pagination="{
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')" ref="table">
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" :style="col.headerStyle" class="font-14 text-black">
            {{ col.label }}
          </q-th>
          <q-th :style="{ width: expandColumnWidth }" />
          <q-th :style="{ width: expandColumnWidth }" />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props" :style="col.style" class="font-14">
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
          <q-td :style="{ width: expandColumnWidth }" class="text-center">
            <q-btn size="md" color="blue" round dense flat icon="unarchive" :loading="unarchivingId === props.row.id"
              @click.stop="unarchiveRow(props.row)">
              <q-tooltip>{{ $t('ProjectDashboard.unarchive') }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <FinancialPlanRow :visible="isExpanded(props.row)" :financial-plan="getFinancialPlan(props.row)"
          :funding-matches="props.row.fundingMatches" :external-id="props.row.external_id" />
      </template>
    </q-table>
  </q-expansion-item>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import FinancialPlanRow from "components/projectDashboard/FinancialPlanRow.vue";
import projectStatusLabels from "src/mixins/projectStatusLabels";
import applicationFilterOptions from "src/mixins/applicationFilterOptions";
import financialPlanExpand from "src/mixins/financialPlanExpand";
import { APPLICATION_TABLE_COLUMN_WIDTHS as COLUMN_WIDTHS } from "src/constants/applicationTableColumns";

export default {
  name: "ArchivedProjectsTable",
  mixins: [projectStatusLabels, applicationFilterOptions, financialPlanExpand],
  components: {
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
      expanded: false,
      loading: false,
      fetched: false,
      searchTimeout: null,
      unarchivingId: null,
    };
  },
  computed: {
    archivedProjects() {
      return this.$store.state.project.archivedProjects;
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    expandColumnWidth() {
      return COLUMN_WIDTHS.expand;
    },
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
          field: row => row.info?.location,
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
    }
  },
  methods: {
    async fetchArchivedProjects() {
      if (this.fetched) {
        return;
      }
      this.loading = true;
      this.fetched = true;
      await this.applyFilters();
      this.loading = false;
    },
    async applyFilters() {
      const filters = {};

      const searchValue = this.search || '';
      if (searchValue.trim() && searchValue.trim().length >= 3) {
        filters.search = searchValue.trim();
      }

      if (this.isAdmin && this.selectedMunicipalities && this.selectedMunicipalities.length) {
        filters.municipality = this.selectedMunicipalities.map(item => item.id || item).join(',');
      }

      if (this.selectedLocations && this.selectedLocations.length) {
        filters.location = this.selectedLocations.map(item => item.title || item).join(',');
      }

      if (this.selectedStatus && this.selectedStatus.length) {
        filters.status = this.selectedStatus.map(item => item.value !== undefined ? item.value : item).join(',');
      }

      if (this.selectedInvestive && this.selectedInvestive.length) {
        filters.investive = this.selectedInvestive.map(item => item.value !== undefined ? item.value : item).join(',');
      }

      if (this.selectedCategories && this.selectedCategories.length) {
        filters.categories = this.selectedCategories.map(item => item.id || item).join(',');
      }

      if (this.tagsKeywords && this.tagsKeywords.length) {
        filters.tags = this.tagsKeywords.map(item => item.id || item).join(',');
      }

      if (this.selectedApplicationSteps && this.selectedApplicationSteps.length) {
        filters.applicationStep = this.selectedApplicationSteps.map(item => item.value || item).join(',');
      }

      await this.$store.dispatch("project/getArchivedProjects", filters);
    },
    async unarchiveRow(row) {
      this.unarchivingId = row.id;
      const result = await this.$store.dispatch("project/unarchiveProjectIdea", { id: row.id });
      this.unarchivingId = null;
      if (result !== false) {
        await this.applyFilters();
        this.$emit("unarchived");
      }
    },
  },
  watch: {
    search: {
      handler: function (val) {
        if (!this.fetched) return;
        clearTimeout(this.searchTimeout);
        const searchValue = val || '';
        if (searchValue.trim().length >= 3 || searchValue.trim() === '') {
          this.searchTimeout = setTimeout(() => {
            this.applyFilters();
          }, 500);
        }
      }
    },
    selectedMunicipalities() {
      if (!this.fetched) return;
      this.applyFilters();
    },
    selectedLocations() {
      if (!this.fetched) return;
      this.applyFilters();
    },
    selectedStatus() {
      if (!this.fetched) return;
      this.applyFilters();
    },
    selectedInvestive() {
      if (!this.fetched) return;
      this.applyFilters();
    },
    selectedCategories() {
      if (!this.fetched) return;
      this.applyFilters();
    },
    tagsKeywords() {
      if (!this.fetched) return;
      this.applyFilters();
    },
    selectedApplicationSteps() {
      if (!this.fetched) return;
      this.applyFilters();
    },
  },
};
</script>
