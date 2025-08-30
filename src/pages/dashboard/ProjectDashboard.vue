<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-2" v-for="(stat, index) in statistics" :key="index">
        <div class="shadow-2 radius-20 q-pa-md" style="height: 130px" :class="index === 0 ? 'total-projects' : ''">
          <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none">{{ stat.title }}</p>
          <p class="font-24 text-weight-bold text-blue q-mb-sm">{{ stat.value }}</p>
        </div>
      </div>
    </div>
    <projectDashboardTable @stats="(val) => (statsData = val)" />
  </q-page>
</template>

<script>
import projectDashboardTable from "components/projectDashboard/Table.vue";
export default {
  name: "projectDashboard",
  data() {
    return {
      statsData: {},
    };
  },
  components: {
    projectDashboardTable,
  },
  computed: {
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
          title: this.$t("ProjectDashboard.totalInvestment") + " (gesamtkosten)",
          value: this.formatCurrency(this.stats?.financialSums.gesamtkosten),
        },
        {
          title: this.$t("ProjectDashboard.grants") + " (personalkosten)",
          value: this.formatCurrency(this.stats?.financialSums.personalkosten),
        },
        {
          title: this.$t("ProjectDashboard.ownFunds") + " (sachkosten)",
          value: this.formatCurrency(this.stats?.financialSums.sachkosten),
        },
        {
          title: this.$t("ProjectDashboard.thirdPartyFunds") + " (investitionskosten)",
          value: this.formatCurrency(this.stats?.financialSums.investitionskosten),
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
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);

  p {
    color: white !important;
  }
}
</style>
