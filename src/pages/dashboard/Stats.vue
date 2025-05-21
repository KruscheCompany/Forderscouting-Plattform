<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <div
        class="col-6 col-md-3"
        v-for="(stat, index) in statistics"
        :key="index"
      >
        <div class="shadow-2 radius-20 q-pa-md" style="height:130px">
          <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none">{{ stat.title }}</p>
          <p class="font-24 text-weight-bold text-blue q-mb-sm">{{ stat.value }}</p>
        </div>
      </div>
    </div>
    <StatsTable @stats="val => (statsData = val)" />
  </q-page>
</template>

<script>
import StatsTable from "components/stats/StatsTable.vue";
export default {
  name: "stats",
  data() {
    return {
      statsData: {}
    };
  },
  components: {
    StatsTable
  },
  computed: {
    statistics() {
      return [
        {
          title: this.$t("Statistics.currentFunding"),
          value: this.statsData.fundings
        },
        {
          title: this.$t("Statistics.projectIdeas"),
          value: this.statsData.projects
        },
        {
          title: this.$t("Statistics.implementationChecklist"),
          value: this.statsData.checklists
        },
        {
          title: this.$t("Statistics.administration/user"),
          value: this.statsData.users
        },
        {
          title: this.$t("Statistics.fundinginfoArchive"),
          value: this.statsData.archivedFundings
        },
        {
          title: this.$t("Statistics.projectinfoArchive"),
          value: this.statsData.archivedProjects
        },
        {
          title: this.$t("Statistics.checklistArchive"),
          value: this.statsData.archivedChecklists
        },
        {
          title: this.$t("Statistics.watchList"),
          value: this.statsData.watchlists
        },
        {
          title: this.$t("Statistics.municipalities"),
          value: this.statsData.municipalities
        },
        {
          title: this.$t("Statistics.projectTotalDups"),
          value: this.statsData.projectTotalDups
        },
        {
          title: this.$t("Statistics.checklistTotalDups"),
          value: this.statsData.checklistTotalDups
        },
        {
          title: this.$t("Statistics.totalDups"),
          value: this.statsData.totalDups
        }
      ];
    }
  },
  methods: {},
  created() {}
};
</script>

<style lang="sass"></style>
