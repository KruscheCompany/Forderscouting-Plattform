<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-2" v-for="(stat, index) in statistics" :key="index">
        <div class="shadow-2 radius-20 q-pa-md" style="height: 105px"
          :class="index === 0 ? 'total-projects' : index === 1 ? 'bg-yellow' : ''">
          <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none">{{ stat.title }}</p>
          <p class="font-24 text-weight-bold text-blue q-mb-sm">{{ stat.value }}</p>
        </div>
      </div>
    </div>
    <priorityTable />
    <projectDashboardTable @stats="(val) => (statsData = val)" />
    <archivedProjectsTable v-if="isLeader || isAdmin" />
  </q-page>
</template>

<script>
import projectDashboardTable from "components/projectDashboard/Table.vue";
import archivedProjectsTable from "components/projectDashboard/ArchivedTable.vue";
import priorityTable from "components/projectDashboard/PriorityTable.vue";
export default {
  name: "projectDashboard",
  data() {
    return {
      statsData: {},
    };
  },
  components: {
    projectDashboardTable,
    archivedProjectsTable,
    priorityTable,
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
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
  mounted() {
    this.getProjectDashboardStats();
  }
};
</script>

<style lang="scss">
.total-projects {
  background: #bfd3ff;

  p {
    color: black !important;
  }
}
</style>
